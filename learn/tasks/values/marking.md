# Marking Guide for Values and Units Tasks

## Task 1 Color

The student needs to take a color which is a hex code and add the same color to other elements using RGB and HSL colors, plus change the opacity of the final item.

They have a link to [a color conversion tool](https://convertingcolors.com/hex-color-86DEFA.html), so they just need to know what the different values look like.

```
.hex {
  background-color: #86DEFA;
}

.rgb {
  background-color: rgb(134, 222, 250);
}

.hsl {
  background-color: hsl(194, 92%, 75%);
}

.transparency {
  background-color: rgba(134, 222, 250, .2);
}
```

## Task 2 Length

The student is asked to use a variety of length units to size some boxes.

```
h1 {
 font-size: 50px;
}

h2 {
  font-size: 2em;
}

p {
 font-size: 16px;
}

h1+p {
 font-size: 120%;
}   
```

## Task 3 position

In this task the students needs to use a keyword and a percentage to change the position of the background image.

```
.box {
  background-image: url(star.png);
  background-repeat: no-repeat;
  background-position: center 20%;
}
```
