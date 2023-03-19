
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

## Usage

NodeJS and MongoDB are required.
> You can run MongoDB in docker as well.

Once executed the server (node server.js) and the client (npm start), go to the server port (1999) will ask you to trust of self-signed certified, than, will redict you to the app
So -> https://10.0.0.3:1999 and boom we there.
> 10.0.0.3 is my Mac's private IP, config yours into the ServerConfig.json into src folder of Walletter app


## Dependencies

- react-scripts
- moment
- @ionic/storage


## HTTPS 
The certified and the private key (that you don't see in this repo), are self-signed, you've to generate yours.

## UX
![walletter](./docs/img/1.png)

![fullscreen](./docs/img/fullscreen.png)


You can add a new transaction and searching for existing reference or add a new one.

![search](./docs/img/fullscreen.png)

From my iPad (have to hide some reference, sorry)
![search](./docs/img/from_iPad.png)


### Various widget

Fullscreen of calendar, clicking a day 
![search](./docs/img/allOfDay.png)

Full screen of grouped (is from my personal account, had to hide, sorry again)

![search](./docs/img/grouped.png)

You can export or import a backup, saved on JSON

![search](./docs/img/grouped.png)


But first, you need to login!

![search](./docs/img/login.png)

### Export/Import
![import](./docs/img/WalletterImport.gif)

## TODO

- at the server startup check if collections exists
- logs
- saving the credentials