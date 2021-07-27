# DAY 7

- took a little break from this project, now back at it
- now miko-orm's `persistAndFlush` is kinda meh, so instead another alternative is to use `querybuilder`
- for that, head over to `user.ts` and make changes to `register`

## CREATE LOGIN FORM

- create a `/login` page
- copy register and make a few changes
- can't user `registermutation` so instead use `loginmutation`
- create `login.graphql`
- update `login.tsx`
- now, create `navbar` component for index

## FETCH ME API ONCE LOGGED IN

- create `graphql/queries/me.graphql`
- update nav to pull in `me` query
