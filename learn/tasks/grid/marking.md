# Grid Tasks Marking Guide

## Grid Layout One

The aim of this task is to show understanding of the basics of creating a grid with a gap between the items.

```
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}
```

## Grid Layout Two

The aim of this task is to demonstrate an understanding of placing an item between grid lines, and that it is possible to layer items by way of them occupying the same grid cells.

I have used the shorthands below, however it would be correct for the student to use the longhand `grid-row-start` for example.

```
.item1 {
 grid-column: 1 / 4;
 grid-row: 1 / 3;
}

.item2 {
 grid-column: 2 / 5;
 grid-row: 2 / 4;
}
```
### Additional question

This extra question requires a little bit of research. One way of achieving this would be to use `order`, which we've encountered in the flexbox tutorial.
```
.item1 {
 order: 1;
}
```
Another valid solution is to use `z-index`:
```
.item1 {
 z-index: 1;
}
```

## Grid Layout Three

This task requires that the student gives each part of the layout a name using the `grid-area` property, then uses `grid-template-areas` to lay them out. Possible areas of confusion would be not realising they should place a `.` to leave a cell empty, or that they should repeat the name to cause an element to span more than one track.

```
.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 2fr;
  grid-template-areas: "aa aa"
                       "bb cc"
                       ". dd";
}

.one {
  grid-area: aa;
}

.two {
  grid-area: bb;
}

.three {
  grid-area: cc;
}

.four {
  grid-area: dd;
}
```

## Grid Layout Four

This task demonstrates the understanding of the student in terms of which components make sense as a grid and which as flex.

The container will need to be a grid layout, as we have alignment in rows and columns - two-dimensional.

The ul for the tags needs to be a flex container as tags are not lined up in columns, only in rows and they are centered in the space with the alignment property `justify-content` set to `center`.

The student may try to use flexbox on the container and restrict the cards with percentage values. They may also try to make the items into a grid layout in which case you should point out that the items are not aligned in two dimensions so grid isn't the best choice.

```
.container {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
```
