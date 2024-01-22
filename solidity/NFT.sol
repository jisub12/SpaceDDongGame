// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/ERC721.sol)

pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "./gameToken.sol";

contract SpaceNFT is ERC721 {
    GameToken public gameToken;

    constructor(
        string memory _name,
        string memory _symbol,
        address gameTokenCA
    ) ERC721(_name, _symbol) {
        gameToken = GameToken(gameTokenCA);
    }

    mapping(uint256 tokenId => string tokenURI) _tokenURIs;

    mapping(uint256 => uint256) public prices;

    // 소유자별로 토큰 ID 저장
    mapping(address => uint256[]) private ownerNFTs;

    uint256 totalSupply = 0;

    function minting(string memory tokenURL, uint256 price) public {
        _tokenURIs[totalSupply] = tokenURL;
        prices[totalSupply] = price;
        _mint(msg.sender, totalSupply); // 여기서 totalSupply는 새로운 토큰의 ID임
        ownerNFTs[msg.sender].push(totalSupply); // 그래서 마지막에 새로 생성된 토큰ID가 담김
        totalSupply += 1;
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return _tokenURIs[_tokenId];
    }

    function _baseURI() internal view override returns (string memory) {
        return "https://jade-petite-constrictor-206.mypinata.cloud/ipfs/";
    }

    // 위임 받는 함수
    function setAppAll(address owner, address operator, bool approved) public {
        _setApprovalForAll(owner, operator, approved);
    }

    function getRanking(
        string memory ranking
    ) public pure returns (string memory) {
        return ranking;
    }

    // NFT 전부 조회
    function gettotalSupply() public view returns (uint256) {
        return totalSupply;
    }

    // 토큰 주인 지갑 계정 확인
    function ownerOf(uint256 tokenId) public view override returns (address) {
        return ERC721.ownerOf(tokenId);
    }

    // 토큰 가격 확인
    function getPrice(uint256 tokenId) public view returns (uint256) {
        return prices[tokenId];
    }

    // 특정 토큰에 대한 승인 설정
    function setApprovalForToken(address to, uint256 tokenId) public {
        approve(to, tokenId);
    }

    // 특정 소유자의 모든 토큰 ID를 반환하는 함수
    function getTokensOfOwner(address owner) public view returns(uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);

        if (tokenCount == 0) {
            // 소유한 토큰이 없는 경우 빈 배열 반환
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalTokens = totalSupply;
            uint256 resultIndex = 0;

            // 각 토큰에 대해
            for (uint256 tokenId = 0; tokenId < totalTokens; tokenId++) {
                // 토큰의 현재 소유자가 검색 중인 소유자와 일치하는 경우
                if (ownerOf(tokenId) == owner) {
                    // 결과 배열에 토큰 ID 추가
                    result[resultIndex] = tokenId;
                    resultIndex++;
                }
            }

            return result;
        }
    }

    // 소유자의 NFT 리스트에서 특정 토큰 제거
    function removeFromOwnerNFTs(address owner, uint256 tokenId) public {
        require(
            msg.sender == owner || msg.sender == address(this),
            "Unauthorized"
        );

        uint256[] storage ownerTokens = ownerNFTs[owner];
        for (uint256 i = 0; i < ownerTokens.length; i++) {
            if (ownerTokens[i] == tokenId) {
                ownerTokens[i] = ownerTokens[ownerTokens.length - 1];
                ownerTokens.pop();
                break;
            }
        }
    }
    
}


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./spaceNFT.sol";
import "./gameToken.sol";

contract sellNFT {
    SpaceNFT public spaceNFT;
    GameToken public gameToken;

    // 토큰 보관 맵핑. 각 주소의 잔액을 기록
    mapping(address => uint256) public CAStorage;

    event PurchaseSuccessful(address buyer, uint256 tokenId, uint256 price);

    constructor(address spaceNFTCA, address gameTokenCA) {
        spaceNFT = SpaceNFT(spaceNFTCA);
        gameToken = GameToken(gameTokenCA);
    }

    // CA에서 CA로 메세지 전송 메서드 실행
    function _sellNFTmint(string memory url, uint256 price) public {
        spaceNFT.minting(url, price);
    }

    // sellNFT에서 SpaceNFT로 메세지를 보내서 NFT권한을 위임받는 함수
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
        uint256 price = spaceNFT.getPrice(tokenId); // NFT가격 가져옴
        address originalOwner = spaceNFT.ownerOf(tokenId); // NFT 원래 소유자 가져옴

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

        emit PurchaseSuccessful(msg.sender, tokenId, price);
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
