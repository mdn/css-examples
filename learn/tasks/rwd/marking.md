# Responsive Web Design Marking Guide

The aim of the tasks are to demonstrate an understanding of the properties covered in the [Beginners Guide to Media Queries](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Media_queries) lesson in Learn Web Development on MDN.

This task not only asks the student to implement media queries correctly, they will also need to use the things they have learned about CSS Layout.

There is no one right answer however the following code demontrates how simply the task can be achieved, and this is really what we are looking for as it is easy to complicate this task. Using modern layout methods of flexbox and grid means that we only need one media query.

```
@media screen and (min-width: 60em) {
  header {
    display: flex; /* separate the nav and title */
    justify-content: space-between;
    align-items: center;
  }

  header ul {
    display: flex; /* mav navigation display using flexbox */
  }

  header li {
    margin: 0; / *remove the margin used in the mobile design */
  }

  header a {
    border: 0; /*remove the border used in the mobile design */
  }

  main {
  display: grid; /* a two column grid layout for the main content and sidebar */
  grid-template-columns: 3fr 1fr;
  gap: 20px;
  margin-top: 20px;
  }

  .cards {
    display: grid; /* a three column layout for the cards */
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }
}
```
