---
title: Implementing visualizations
author: Sebas
date: 2022-04-13
layout: page
---

Creating visualizations with code is difficult. Examples are:
- processing
- d3
- ...

The difficulty of the coding task relies on the abstract nature of code. You have only 2 states: the code and the end result. Some ideas have appeared that seem to solve this:
- reducing the gap of evaluation: this is done by executing the code after any change on it and let you see your changes (Any playground: CodeSandbox, Codepen, ...)
- modularizing and creating the graph of execution (Observablehq.com)

However the best idea seem to use visualizations techniques to visualize the code. The most notable example of this are tools like:
- Noodle 
- CrissCut
- Any node tool for shaders

Wisiwig tools like webflow tend to show the final result and let you tweak the elements by selecting and then changing parameters. 

Excel provides a graph in a table.

Those tools let you see in a graph the code, but they have shortcomings:
- Simple tasks are reduced to many nodes (Crisscut)
- Batch changes are difficult (you can only change single elements or a selection of elements with a limited operation)
- Not compliant with versioning tools like git
- Information becomes structured in a certain way and forces a unique kind of thinking --> It's all nodes 
- No API to change elements, everything is manual
