# Cascade and inheritance marking guide

## Task 1

One possible solution is as follows:

```
#outer #inner a {
  background-color: initial;
}
```

There are two things the student needs to do in this task. First, write a selector for the `a` element which is more specific than the selector used to turn the background powderblue. In this solution, this is achieved by using the `id` selector, which has very high specificity.  

Then the student needs to remember there are special keyword values for all properties. In this case, using `inherit` sets the background color back to be the same as its parent element.

## Task 2

One possible solution is as follows:

```
 @layer yellow, green, purple;
```

There is one thing the student needs to do in this task: change the order of precedence so the declaration for the desired color is in the last declared layer, which is what his solution shows.

The student needs to remember that unlayered normal styles take precedence over layered normal styles. But, if all styles are within layers — as in the case of this task — styles in later declared layers take precedence over styles declared in earlier layers. Moving the purple layer to the end means it has precedence over the green and yellow layers.