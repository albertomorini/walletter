
# Walletter

A simple personal finance tool.
Made in my free time with NodeJS, ReactJS/Ionic, MongoDB.

## The idea
You can do two things with money: earn it or spend it.

Every transaction has the same metadata:
    - Amount of money (spent or earned)
    - Date
    - Motivation (like salary, gourcery etc)
    - Verse (if is an income or an outcome)

So the database goes along.


## Database

Made with Mongo, why? Why not.
Two collections, that's all we need.

WT_REGISTER
```json
{
    "import":23,
    "date":"11/02/22",
    "type": "out",
    "causale":"cadoro",
    "idUtente": $Email
}
```
WT_USERS

```JSON
{
    "Email": $Email,
    "Password": md5($Password)
    "Premium": false
}
```

## UX
TODO

## TODO

- reload list on insert/delete/edit
