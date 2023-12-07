// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";


contract GameToken is ERC20 {
    constructor() ERC20("SpaceToken", "STK") {
        _mint(msg.sender, 100000 * 10 ** decimals()); // 초기 토큰 생성
    }
}