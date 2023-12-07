// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./spaceNFT.sol";
import "./gameToken.sol";

contract sallNFT {
    SpaceNFT public spaceNFT;
    GameToken public gameToken;

    // 토큰 보관 맵핑. 각 주소의 잔액을 기록
    mapping(address => uint256) public CAStorage;

    event PurchaseSuccessful(
        address indexed buyer,
        uint256 tokenId,
        uint256 price,
        address indexed seller
    );

    constructor(address spaceNFTCA, address gameTokenCA) {
        spaceNFT = SpaceNFT(spaceNFTCA);
        gameToken = GameToken(gameTokenCA);
    }

    // CA에서 CA로 메세지 전송 메서드 실행, 실행시킬 때 url 을 msg.sender로 요청
    function _sellNFTmint(
        address user,
        string memory url,
        uint256 price
    ) public {
        spaceNFT.minting(user, url, price);
    }

    // saleNFT에서 SpaceNFT로 메세지를 보내서 NFT권한을 위임받는 함수
    function setApprovalForAll() public {
        spaceNFT.setAppAll(msg.sender, address(this), true);
    }

    // 실행 시킨 사람이 판매 CA에게 NFT의 권한을 위임했는지 확인하는 함수
    function sellNFT() public view returns (bool) {
        return spaceNFT.isApprovedForAll(msg.sender, address(this));
    }

    // 특정 토큰에 대한 승인 설정
    function _setApprovalForToken(address to, uint256 tokenId) public {
        spaceNFT.setApprovalForToken(to, tokenId);
    }

    // 구매 신청
    function buyNFT(uint256 tokenId) public {
        // NFT가격 가져옴
        uint256 price = spaceNFT.getPrice(tokenId);

        // 구매자 토큰 잔액 확인
        require(gameToken.balanceOf(msg.sender) >= price, "Not enough Tokens");
        require(
            gameToken.allowance(msg.sender, address(this)) >= price,
            "Not enough allowance"
        );

        // 구매자로부터 토큰을 이 컨트랙트로 전송함
        require(
            gameToken.transferFrom(msg.sender, address(this), price),
            "Token transfer failed"
        );
        CAStorage[msg.sender] += price; // 구매자 토큰 저장
    }

    // 판매 확정 함수
    function NFTBuySuccess(uint256 tokenId) public {
        // 구매 정보 확인
        uint256 price = spaceNFT.getPrice(tokenId);
        address originalOwner = spaceNFT.ownerOf(tokenId);

        // 판매자에게 토큰 전송, NFT가격 가져와서 원래 소유자에게
        require(
            gameToken.transfer(originalOwner, price),
            "Token transfer to seller failed"
        );

        // 구매자에게 NFT 전송
        spaceNFT.transferFrom(spaceNFT.ownerOf(tokenId), msg.sender, tokenId);

        // 원 소유자 토큰 제거
        // spaceNFT.removeFromOwnerNFTs(originalOwner, tokenId);

        // CA 잔액 업데이트
        CAStorage[msg.sender] -= price;

        emit PurchaseSuccessful(msg.sender, tokenId, price, originalOwner);
    }

    // 저장된 토큰 양 조회
    function getStoredTokens(address userAddress)
        public
        view
        returns (uint256)
    {
        return CAStorage[userAddress];
    }
}
