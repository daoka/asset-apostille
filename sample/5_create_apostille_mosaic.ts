import { NEMLibrary, NetworkTypes, Account, TransactionHttp, AssetDefinitionCreationTransaction, TimeWindow, AssetId, AssetProperties, AssetDefinition, PublicAccount } from "nem-library";

NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

// same account as when created apostille
const account = Account.createWithPrivateKey('YOUR_PRIVATE_KEY');

const transactionHttp = new TransactionHttp([{protocol: 'https', domain: 'nistest.opening-line.jp', port: 7891}]);

// create apostille tx hash.
const apostilleTxHash = 'APOSTILLE_TX_HASH';

const rootName = 'YOUR_ROOT_NAMESPACE'

const signedHash: string = account.signMessage(apostilleTxHash).toString();
// mid sub-namespace
const signedHashTop = signedHash.substr(0, 64)
// end sub-namespace
const signedHashMid = signedHash.substr(64, 32);

const namespace = rootName + '.' + signedHashTop + '.' + signedHashMid;
console.log(namespace);

// To use create mosaic.
const signedHashEnd = signedHash.substr(96);

const mosaicDefinitionTx = AssetDefinitionCreationTransaction.create(
  TimeWindow.createWithDeadline(),
  new AssetDefinition(
    PublicAccount.createWithPublicKey(account.publicKey),
    new AssetId(namespace, signedHashEnd),
    apostilleTxHash,
    new AssetProperties(0, 1, true, true)
  )
);

const signedTx = account.signTransaction(mosaicDefinitionTx);

transactionHttp.announceTransaction(signedTx).subscribe(
  (x) => { console.log(x) },
  (err) => { console.error(err) }
)
