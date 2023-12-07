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

    // 소유권 확인 매핑
    mapping (address => mapping (address => bool)) internal  _operatorApprovals;

    uint256 totalSupply = 0;

    function minting(address owner, string memory tokenURL, uint256 price) public {
        _tokenURIs[totalSupply] = tokenURL;
        prices[totalSupply] = price;
        _mint(owner, totalSupply); // 여기서 totalSupply는 새로운 토큰의 ID임
        ownerNFTs[owner].push(totalSupply); // 그래서 마지막에 새로 생성된 토큰ID가 담김
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

    // 소유권 권한 확인 함수
    function isOperatorApproved(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }
    
}
