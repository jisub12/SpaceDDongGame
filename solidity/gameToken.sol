// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GameToken is ERC20 {
    constructor() ERC20("GameToken", "GT") {
        // CA에 직접 민팅
        _mint(address(this), 10000 * 10**decimals());
    }

    struct UserInfo {
        uint256 tokenAmount;
    }

    mapping(address => UserInfo) public userInfo;
    
    // 현재까지 얻은 토큰의 양 조회
    function getMyToken() public view returns (uint256) {
        return userInfo[msg.sender].tokenAmount / (10**decimals());
    }
    // CA에서 직접 사용자에게 토큰 전송
    function saveToken(uint256 gameTokenAmount) public {
        // 얻은 토큰 단위 변환해서 전송
        uint256 tokenAmountInWei = gameTokenAmount * (10**decimals());
        require(tokenAmountInWei > 0, "need to get Token");
        require(balanceOf(address(this)) >= tokenAmountInWei, "CA need Token");
        userInfo[msg.sender].tokenAmount += tokenAmountInWei;
        _transfer(address(this), msg.sender, tokenAmountInWei);
    }
}

// 유저는 게임을 통해 일정 확률로 토큰을 얻는다.

// 1. 토큰을 획득하면 로컬에 저장된다. O 
// 2. 저장된 토큰은 게임이 끝나면 / 컨트렉트에 저장된다. O
// 3. 컨트렉트에 저장된 토큰은 마이페이지에서 수량을 조회할 수 있다. O