# Marking Guide for Tables tasks

The lesson on styling tables takes a plain table and styles it in a garish way. In the task we ask the student to create a far more subtle version of the table using some best practices for table readability from https://alistapart.com/article/web-typography-tables/.

The below is a sample of how the end result could be achieved, using similar techniques to the lesson. However there are a number of ways that would be perfectly correct, perhaps slightly more verbose.

```
table {
  border-top: 1px solid #999;
  border-bottom: 1px solid #999;
  border-collapse: collapse;
  table-layout: fixed;
}

th, td {
  vertical-align: top;
  padding: .3em;
}

tr :nth-child(2),
tr :nth-child(3) {
  text-align: right;
}

tr :nth-child(1),
tr :nth-child(4) {
  text-align: left;
}

tbody tr:nth-child(odd) {
  background-color: #eee;
}

tfoot {
  border-top: 1px solid #999;
}

tfoot tr :nth-child(1) {
  text-align: right;
}

tfoot tr :nth-child(2) {
  text-align: left;
}
```
