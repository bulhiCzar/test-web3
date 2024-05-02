import {useAccount, useContractWrite, useReadContract} from "wagmi";
import {StakingBlackDer} from "../contract/StakingBlackDer";
import {ethers} from "ethers";

export const Reward = () => {
    const account = useAccount()
    const { data: calculateReward, refetch } = useReadContract({
        abi: StakingBlackDer.abi,
        address: StakingBlackDer.address,
        functionName: 'calculateReward',
        args: [account.address],
    })

    const { writeContractAsync, isPending } = useContractWrite()

    const handlerWithdrawAll = async () => {
        await writeContractAsync({
            abi: StakingBlackDer.abi,
            address: StakingBlackDer.address,
            functionName: 'unstake',
        })
        refetch()
    }

    return (
        <div>
            My Rewards (APR: )
            <br />
            {ethers.formatEther(calculateReward as number || 0)}
            <br/><br/>

            <button
                onClick={handlerWithdrawAll}
            >
                Withdraw all
            </button>
        </div>
    )
}