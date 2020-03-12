# The Cascade Task Marking Guide

One possible solution is as follows:

```
#outer #inner a {
  background-color: initial;
}
```

There are two things the student needs to do in this task. First, you need to write a selector for the a element which is more specific than the selector used to turn the background blue. I have achieved this by using the id selector which has very high specificity.

Then they need to remember that there are special keyword values for all properties. In this case I am using inherit to set the background back to be the same as its parent element.