// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./gameToken.sol";

contract RankingContract {
    struct Player {
        address playerAddress;
        uint256 score;
        uint256 lastClaimed;
    }

    Player[3] public rankings; // Top 3 rankings
    GameToken public gameToken;

    constructor(address gameTokenAddress) {
        gameToken = GameToken(gameTokenAddress);
    }

    function submitScore(uint256 score) public {
        // 점수가 최소한 3등보다 높아야됌
        require(score > rankings[2].score, "need a higher score");
        // 점수 같으면 등록 안됌 (먼저 등록한 사람이 우선권)
        for (uint256 i = 0; i < rankings.length; i++) {
            require(
                score != rankings[i].score,
                "you can`t submit cuz same score"
            );
        }
        for (uint256 i = 0; i < rankings.length; i++) {
            if (score > rankings[i].score) {
                // 새로운 점수가 랭킹에 들어갈 경우
                for (uint256 j = rankings.length - 1; j > i; j--) {
                    rankings[j] = rankings[j - 1]; // 기존 랭킹을 하나씩 밀어내기
                }
                rankings[i] = Player(msg.sender, score, block.timestamp); // 새로운 점수를 랭킹에 추가
                break;
            }
        }
    }

    function claimRewards() public {
        for (uint256 i = 0; i < rankings.length; i++) {
            if (rankings[i].playerAddress == msg.sender) {
                uint256 timeElapsed = block.timestamp - rankings[i].lastClaimed;
                uint256 rewardAmount = ((i == 0 ? 3 : (i == 1 ? 2 : 1)) *
                    timeElapsed) / 60; // 1분마다 지급되는 토큰 계산

                rankings[i].lastClaimed = block.timestamp; // 마지막으로 보상을 청구한 시간 업데이트
                gameToken.transfer(msg.sender, rewardAmount); // 토큰 보상 지급
                break;
            }
        }
    }

    // 스코어 조회
    function getRankingScores() public view returns (Player[3] memory) {
        return rankings;
    }
}
