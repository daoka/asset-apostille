import { NEMLibrary, NetworkTypes, Account, TransactionHttp, ProvisionNamespaceTransaction, TimeWindow } from "nem-library";

NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

// same account as when created apostille
const account = Account.createWithPrivateKey('YOUR_PRIVATE_KEY');

const transactionHttp = new TransactionHttp([{protocol: 'https', domain: 'nistest.opening-line.jp', port: 7891}]);

const rootName = 'YOUR_ROOT_NAMESPACE';

const provisionNamespaceTx = ProvisionNamespaceTransaction.create(
  TimeWindow.createWithDeadline(),
  rootName
);

const signedTx = account.signTransaction(provisionNamespaceTx);

transactionHttp.announceTransaction(signedTx).subscribe(
  (x) => { console.log(x) },
  (err) => { console.error(err) }
);