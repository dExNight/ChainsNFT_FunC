import { Address, Cell, Dictionary, DictionaryValue, beginCell, contractAddress, fromNano, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { NFT_Collection } from '../wrappers/NFT_Collection';

const CONTRACT_ADDRESS: string = 'EQAVe1UrVLZKYY2V93PuD0c_YBCz249Bocz9JcIEaxtUQ2DU';

export async function run(provider: NetworkProvider) {
    const index: number = 6;
    const nft_content = beginCell().storeStringTail(`item_${index}.json`).endCell();

    const cell = beginCell().storeAddress(provider.sender().address).storeRef(nft_content).endCell();

    const msg_body = beginCell()
        .storeUint(1, 32)
        .storeUint(0, 64)
        .storeUint(index, 64) // item index
        .storeCoins(toNano('0.03')) // forward amount
        .storeRef(cell)
        .endCell();
    const tons_to_mint = toNano('0.03');

    const nft_collection_contract = provider.open(NFT_Collection.createFromAddress(Address.parse(CONTRACT_ADDRESS)));

    await nft_collection_contract.sendMintRequest(provider.sender(), tons_to_mint, index, 0.03, nft_content);
}
