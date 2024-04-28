import { Address, toNano } from '@ton/core';
import { NFT_Collection } from '../wrappers/NFT_Collection';
import { compile, NetworkProvider } from '@ton/blueprint';

const NFT_COLLECTION_METADATA =
    'https://raw.githubusercontent.com/Amir23714/BeautifulChairs/main/collection_metadata.json';
const NFT_COLLECTION_METADATA_BASE = 'https://raw.githubusercontent.com/Amir23714/BeautifulChairs/main/';

const OWNER_ADDRESS = Address.parse('0QAAeHjRVfqPfRIjkPlxcv-OAffJUfAxWSu6RFli4FUeUCRn');

export async function run(provider: NetworkProvider) {
    const collection_content = {
        uri: NFT_COLLECTION_METADATA,
        base: NFT_COLLECTION_METADATA_BASE,
    };

    const royalty_params = {
        numerator: 20,
        denominator: 100,
        destination_address: OWNER_ADDRESS,
    };

    const config = {
        owner_address: OWNER_ADDRESS,
        next_item_index: 0,
        collection_content: collection_content,
        nft_item_code: await compile('NFT_Item'),
        royalty_params: royalty_params,
    };

    const nft_collection_contract = provider.open(
        NFT_Collection.createFromConfig(config, await compile('NFT_Collection')),
    );

    await nft_collection_contract.sendDeploy(provider.sender(), toNano('0.03'));

    await provider.waitForDeploy(nft_collection_contract.address);
}
