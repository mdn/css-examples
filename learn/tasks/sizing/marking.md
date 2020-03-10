# Marking Guide for sizing tasks

## Task 1 height and min-height

There are two boxes, the first should be given a minimum height, in which case it will expand to take the additional content but if the student removes some content the box will be at least as tall as the min-height. The second is given a fixed height which will cause content to overflow.

```
.box1 {
  min-height: 100px;
}

.box2 {
  height: 100px;
}
```

## Task 2 percentages

The container is 400 pixels wide. The student is asked to make the box 60 percent of the container and to give it 10% of padding on all sides. All elements already have `box-sizing: border-box` to save the student worrying about which width they are using, and this is explained in the task instruction.

```
* {
  box-sizing: border-box;
}
.inner {
  width: 60%;
  padding: 10%;
}
```

## Task 3 max-width and images

The example has an image which is breaking out of the box and one which is smaller than the box, the student needs to use max-width set to 100% to cause the larger image to grow only as large as the box. If they use width: 100% then the small image will stretch.

```
img {
 max-width: 100%;
}
```
