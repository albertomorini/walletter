
# Walletter

A simple personal finance tool.

Made in my free time with NodeJS, ReactJS/Ionic and MongoDB.
> I'll use React's hooks and context ;)

## The idea
You can do two things with money: earn it or spend it.

Every **transaction** has the same metadata:

- Amount of money (spent or earned)
- Date of transasction
- Reference/Motivation (eg. salary, gorcery, gift etc)
- Verse (if is an income or an outcome)

So the database goes along.

## Database

Made with Mongo, why? Why not.

Two collections, that's all we need.

WT_TRANSACTIONS
```json
{
    "Email":"alberto@morini",
    "Amount": 44,
    "Date":"2023-03-10",
    "IsOutcome": true,
    "Reference":"Gorcery"
}
```
WT_USERS

```JSON
{
    "Email": "user@email",
    "Password": "98a3629dc3d351915dfe959221ccb812",//md5 of psw
    "Premium": false //not used right now
}
```

## Dependencies

- moment
- @ionic/storage


## UX

![walletter](./docs/img/Walletter.gif)

### Export/Import
![import](./docs/img/WalletterImport.gif)

## TODO

- https and authentication
    - try  https://letsencrypt.org/
- at the server startup check if collections exists
- logs