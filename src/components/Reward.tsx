import {useAccount, useContractWrite, useReadContract} from "wagmi";
import {StakingBlackDer} from "../contract/StakingBlackDer";
import {ethers} from "ethers";

export const Reward = () => {
    const account = useAccount()
    const { data: dataCalculateReward, refetch } = useReadContract({
        abi: StakingBlackDer.abi,
        address: StakingBlackDer.address,
        functionName: 'calculateReward',
        args: [account.address],
    })
    const calculateReward = dataCalculateReward as number || 0

    const { writeContractAsync, isPending } = useContractWrite()

    const isDisabled = calculateReward <= 0

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
            {ethers.formatEther(calculateReward)}
            <br/><br/>

            <button
                onClick={handlerWithdrawAll}
                disabled={isDisabled}
            >
                Withdraw all
            </button>
        </div>
    )
}