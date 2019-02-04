# Apostille asset

- [Japanese](./README_ja.md)

## Background

- NEM's Apostille has two types. The first is public apostille. The second is private apostille.
- Public apostille is simply. Public apostille can only timestamp.
- Private apostille has original notarized account. Private apostille can update, split and transfer by multi-sig account. So, apostille is said to be superior to other timestamp notarization.
- However, private apostille has below issue.
    - Leakage risk of private key before converting multi-sig account.
    - Multi-sig modification is difficult than transfer.
    - Become catapult, an account can be cosigner of X multi-sig accounts. This means that the number of apostille that the account can hold is limited.

## Improvement by assetting

- Using multi-sig account apostille can split and/or transfer. But, that has some problem. So, we consider using mosaic.

### Implementation plan for NIS1

We create the mosaic that attached apostille. The attachment is uses the transaction hash that created apostille.
But, the simple attachment makes the fake mosaic easily. So, we are using signed transaction hash. Signed transaction hash is applied to namespace and mosaic.
The specific implementation is as follows.

1. Create apostille.
2. Sign the transaction hash that created apostille.
3. Split signed transaction hash. And apply to namespace following rule.
    - (any root namespace).(first 64 digits of singed transaction).(65th digit to 96th digits of signed transaction)
4. Create the mosaic following rules.
    - Mosaic Name: Last 64 digits of signed transaction.
    - Description: Original transaction hash.
    - Initial supply: Number of rights.
    - Divisibility: 0
    - Mutable supply: If division / merge will occur later, enable it.
    - Transferable: Set as necessary.
    - Levy: Usually not necessary.

- [Samples](./sample)

### Audit

To audit that the mosaic is created by apostille creator, using to the signed transaction hash that restored from the namespace and mosaic name and the original transaction hash that described in the mosaic description and apostille creators public key.

### Advantage

- Right transfer is easier than using multi-sig.
- The number of divisions can be increased more than multi-sig.
  - multi-sig: max 32.
  - mosaic: max 9 billion.
- Apostille asset can use to public apostille.
- After becoming catapult, an account can hold apostille asset unlimited.

### Disadvantage

- The Fee is higher than using multi-sig.
- The expression of right is lost when you forget to update the namespace.

## Use case.

- Representation of ownership percentage of common interest.
- Application to what needs to be issued in large quantities (ie: game item assets)

## Implementation plan for NEM2(Catapult)

### NEM2's function adding and specification change

Apostille asset is affected by the following additions and changes in specifications.

- Separation of mosaics from namespaces [(ref)](https://github.com/nemtech/catapult-server/issues/20)
- Metadata Key/Value Association & Store [(ref)](https://github.com/nemtech/NIP/issues/8)

### Implementation for NEM2

1. Create apostille.
2. Create mosaic. Set the properties of the mosaic in the same way as NIS1. And set mosaic's metadata followings.
    - OriginalHash : Transaction hash that created apostille.
    - SignedHash : Signed transaction hash with apostille creator's private key.
3. We can alias any namespace.

### Extension apostille by NEM2

Using metadata, we can add apostille's information. For example, original document URL, Approver's information, abstract rights information and so on.