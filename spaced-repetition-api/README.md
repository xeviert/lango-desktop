# Lango - API
### Language Learning App

## Live App: https://spaced-repetition-plum.vercel.app/

## API ENDPOINTS

```
/api/auth/token
-- POST - user login using JWT

/api/language
-- GET - gets list of words in the language assigned to user

/api/language/head
-- GET - gets first word of collection

/api/language/guess
-- POST - processes user guess and creates a linked list

/api/user
-- POST - creates a new user with name, username, and password
```

This project uses spaced repetition to teach French. After creating an account, the user guesses the translation for the French word and the next page shows if they got the word right or wrong. 

For each user, score is kept on how many times they have guessed on the word, the correct and incorrect number of guesses on each word.

If you would like to quickly demo Lango, please use the login credentials below.
Username: admin
Password: pass

### Future Plans
- For personal use, I'm currently in the process of adding more languages and adding the 100 most used words of those languages. 
- I'll also be adding an extra page where the user gets to choose the language. 
- Unit testing will be added as well.