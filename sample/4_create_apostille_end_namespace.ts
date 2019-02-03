import { NEMLibrary, NetworkTypes, Account, TransactionHttp, ProvisionNamespaceTransaction, TimeWindow } from "nem-library";

NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

// Same account as when created apostille.
const account = Account.createWithPrivateKey('YOUR_PRIVATE_KEY');

const transactionHttp = new TransactionHttp([{protocol: 'https', domain: 'nistest.opening-line.jp', port: 7891}]);

// create apostille tx hash.
const apostilleTxHash = 'APOSTILLE_TX_HASH';

const rootName = 'YOUR_ROOT_NAMESPACE';

const signedHash: string = account.signMessage(apostilleTxHash).toString();

// To use create sub-namespace.
const signedHashTop = signedHash.substr(0, 64);

const parentNamespace = rootName + '.' + signedHashTop;

const signedHashMid = signedHash.substr(64, 32);

const provisionNamespaceTx = ProvisionNamespaceTransaction.create(
  TimeWindow.createWithDeadline(),
  signedHashMid,
  parentNamespace
);

const signedTx = account.signTransaction(provisionNamespaceTx);

transactionHttp.announceTransaction(signedTx).subscribe(
  (x) => { console.log(x) },
  (err) => { console.error(err) }
);