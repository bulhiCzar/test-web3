import {useAccount, useBalance, useContractWrite, useReadContract, useReadContracts, useToken} from "wagmi";
import {StakingBlackDer} from "../contract/StakingBlackDer";
import {FormEventHandler, useEffect, useState} from "react";
import {ethers} from "ethers";

export const Details = () => {
    const [value, setValue] = useState<string>('')

    const account = useAccount()
    const { writeContractAsync, isPending } = useContractWrite()

    const {
        data: {
            symbol: balanceSymbol = '',
            value: balanceValue = 0
        } = {},
        refetch: balanceRefetch,
    } = useBalance({
        address: account.address,
        token: '0xe7BFe5D36C476b3B1B6C552E2e539B785D00841F',
    })

    const {
        data: balanceStake = [0, 0, 0],
        refetch: balanceStakeRefetch,
    } = useReadContract({
                address: StakingBlackDer.address,
                abi: StakingBlackDer.abi,
                functionName: 'stakes',
                args: [
                    account.address,
                ]
    })

    const disabledSubmitStake = ethers.parseEther(value || '0') > (balanceValue || 0)
        || balanceValue == 0
        || value == ''
        || isPending

    // set stake
    const handlerSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        await writeContractAsync({
            abi: StakingBlackDer.abi,
            address: StakingBlackDer.address,
            functionName: 'stake',
            args: [
                ethers.parseEther(value)
            ],
        })
        // бесполезно, потому что await выше проходит быстрее, чем транза в блойкчейне
        balanceRefetch()
        balanceStakeRefetch()
        setValue('')
    }

    return (
        <div>
            Address: {account.address}
            <br/>
            Balance: {ethers.formatEther(balanceValue)} {balanceSymbol}
            <br/>
            Staked: {ethers.formatEther((balanceStake as number[])?.[0])} {balanceSymbol}
            <br/>

            <form onSubmit={handlerSubmit}>
                <input
                    placeholder="100 $BSN"
                    name="value"
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <br/>
                <button
                    type="submit"
                    disabled={disabledSubmitStake}
                >
                    Allow staking
                </button>
            </form>

        </div>
    )
}