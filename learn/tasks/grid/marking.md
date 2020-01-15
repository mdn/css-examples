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
