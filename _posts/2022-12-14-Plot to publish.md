---
layout: post
title: "Producing & Exporting Figures with Multiple Panels"
subtitle: Story telling in Research
#cover-img: /assets/img/path.jpg
#thumbnail-img: /assets/img/thumb.png
#share-img: /assets/img/path.jpg
tags: [science, Graphs, Tips, pro-insights]
comments: true
#author: "muafzal"
#output: html_document
---
Data visualization is an integral part of the research process and reporting in industrial/business context. Often, we need to combine multiple plots so that each plot is a subplot (panel) in the main plot. The need to combine multiple plots originates from conveying a complete story or one part of a bigger story using one figure containing multiple plots. `R` is widely used for statistical programming and data analysis in a variety of fields. Different kinds of graphs - basic to highly sophisticated, can be produced using `R`. Many users, usually the beginners, might find it difficult to combine multiple plots into a single figure. 

### Objective

The objective of this post is to provide insights on avoiding extra step of exporting plots to another software such as `Inkscape` or `Adobe Illustrator`, the latter being an expensive software not affordable by everyone. Although `Inkscape` is an amazing open source software, you would still need time to bring your individual plots into it and combine them, which cost considerable time. Remember, time is gold of anybody, especially of researchers. **Therefore**, we will explore the option to achieve our goal of combining plots in an automated way, saving time and money.

**Note:** I would like to state that under certain circumstances, there might be no option other than using `Inkscape` or `Adobe Illustrator`, for instance, when you are required to produce an illustration, a graphical abstract or combine multiple plots after they have been produced using different software. Also, it is common to combine plots based on the evolution of your story. In such case, I would prefer to use `Inkscape` because it is open source and provides all tools that you need. ***See one of my other posts*** in this regard.

### Action

`R` package `cowplot` can be very useful to combine multiple plots. In the following, I will demonstrate how you can use this package. Afterwards, I will show you two options to export your plots. First, using `ggsave2`function from `cowplot` package. Second, using base-R `png` (`pdf` or `tiff`) functions.

In this post, you will see a basic version of the plots since our focus is on combining and exporting plots. However, to see how you can beautify your plots, ***see one of my other posts*** specifically on this topic. 
First of all, we load the data and libraries.

```{r}
data("iris")
library(ggplot2)
library(cowplot)
```

### ***First option - ggplot*** 

First, let's see an example to produce plots by using `ggplot` package.

```{r}
gp1 <- ggplot(aes(Sepal.Length, Sepal.Width), data=iris) + geom_point()
gp2 <- ggplot(aes(Petal.Length, Petal.Width), data=iris) + geom_point()
plot_grid(gp1, gp2, labels = "AUTO", nrow = 1, ncol = 2)
```
Note that you can either remove the labels of the panels by removing `labels = "AUTO",` argument or get small letters by using `labels = "auto"`. Simulateously, you can also adjust the grid depending on the number of plots you want to combine. Explore all options by running `?plot_grid` in console. After running the `plot_grid` function, as shown above, use `ggsave2` function to export your plot in one of the desired formats such as png, pdf, and eps etc. You can define plot size to fulfill the journal requirements. Usually, the requirements can be found under "Instructions for Authors" section of the journals. 

To exemplify, the following code will produce a figure to meet the "two-column figure" requirements of most of the Nature journals. Note that width and height provided in millimeters.

```{r}
cowplot::ggsave2("Figure_1.png", plot = ggplot2::last_plot(), width = 183, height = 80, units = "mm", dpi = 500)
cowplot::ggsave2("Figure_1.pdf", plot = ggplot2::last_plot(), width = 183, height = 80, units = "mm", dpi = 500)
cowplot::ggsave2("Figure_1.eps", plot = ggplot2::last_plot(), width = 183, height = 80, units = "mm", dpi = 500)
```
Note that the last three characters of the name (extension at the end after ".") of the output plot are changed to save it in a chosen format.

### ***Second option - base-R***

In case you prefer to use base-R to make plots, the following approach might fit well for combining and exporting your figures.

```{r}
p1 <- ~{ plot(iris$Sepal.Length, iris$Sepal.Width) }
p2 <- ~{ plot(iris$Petal.Length, iris$Petal.Width) }

png("Figure_2.png", width = 183, height = 80, units = 'mm', res = 500)
plot_grid(p1, p2, labels = "AUTO", nrow = 1, ncol = 2)
dev.off()
```

Whenever you use base-R `tiff`, `png` or `pdf` function, DO NOT forget to run `dev.off()` command after running your code for plot. Regarding size of the text, axis-labels etc, use the standard arguments for generic plot function of base-R. Run `?plot` in console to see different options for customization.

### Conclusion

We explored two approaches to combine multiple plots into one figure and export it in different formats to satisfy the journal requirements or personal choice. If you ask me, I prefer to use `ggplot` approach because of high flexibility to customize plots and vast ecosystems of helper packages to produce awesome graphs. ***See one of my other posts*** on `ggplot` and its helper packages that provide tremendously helpful functions for efficient graph production.




