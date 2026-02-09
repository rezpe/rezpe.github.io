---
title: Whiteboard, Voice, and AI; The Future of Motion Graphics Design
author: Sebas
date: 2026-02-09
layout: page
---

![Hero: Whiteboard, Voice, and AI for Motion Graphics](/assets/images/the-whiteboard-as-the-future-of-computer-interaction/hero.png)

## The Problem: You Can't Tell a Computer What Motion Feels Like

![The artist struggles to fit creative ideas into structured computer interfaces](/assets/images/the-whiteboard-as-the-future-of-computer-interaction/problem.png)

The motion you see in your head — a title that swoops in playfully, bars that grow with a satisfying bounce, a transition that feels like a page turn — cannot be expressed directly in any current tool. It has to be decomposed into the tool's structured language: keyframes, easing functions, layer hierarchies, numerical parameters. The creative intent is yours; the translation work is also yours.

Bret Victor identified this problem over a decade ago. In "Stop Drawing Dead Fish" [1], he argued that the assumption underlying every animation tool — that creating behavior means writing code or manipulating algebraic parameters — is wrong. Artists have always created by directly manipulating their medium. Computers should extend that, not replace it with spreadsheets of keyframes. In "Inventing on Principle" [2], he distilled this into a design rule: creators need an immediate connection to what they create. When you make a change, you should see the effect instantly.

What Victor couldn't have in 2013 was an AI that interprets intent. That's what's changed. Multimodal models can now read rough sketches, understand spoken narration, and generate structured output from both. The combination of a whiteboard canvas, voice narration, and AI interpretation might finally deliver what Victor envisioned — not through better code editors or smarter keyframe tools, but by removing the translation layer entirely.

In this article, I'll describe the translation problem in motion graphics, survey the tools and research converging toward a solution, lay out what a whiteboard-and-voice-driven workflow could look like, and describe the experiment I'm building to test it — along with the challenges that experiment needs to address.

## Why Every Motion Tool Makes You Translate Feel Into Parameters

In After Effects, the industry standard, animating a simple title sliding in from the left means creating a composition, adding a text layer, setting an initial position keyframe off-screen, moving the playhead forward, setting a final position keyframe on-screen, then adjusting the easing curve in the graph editor so the motion doesn't look robotic. For a 30-second explainer video, you might manage hundreds of keyframes across dozens of layers, each with their own property curves. The interface has hundreds of panels, thousands of parameters, and a skill floor measured in months.

Node-based tools like Cavalry and DaVinci Fusion take a different approach — you wire together generators, modifiers, and renderers in a visual graph rather than stacking layers on a timeline. It's more procedural and powerful for data-driven animation, but the abstraction is equally technical. You're connecting nodes in a directed acyclic graph, not expressing creative intent.

These are remarkable tools. Professionals value them precisely because they offer granular control. But that control comes at the cost of accessibility: every one of these tools requires the user to translate spatial, temporal, and emotional intent into structured parameters. The richer the creative vision, the more painful the translation.

This is Victor's dead fish problem, scaled up. The artist knows exactly what they want the motion to feel like. The tool demands they express it in a language that has no word for "feel."

![The artist imagines a bird flying but has to edit a complex timeline](/assets/images/the-whiteboard-as-the-future-of-computer-interaction/translation.png)

## The Innovation Pieces Already Exist

The pieces needed to solve this problem are arriving from different directions. No single project has assembled them, but the pattern across all of them is consistent: unstructured human input goes in, structured machine output comes out.

**AI can now interpret rough visual input.** This is no longer theoretical. In late 2023, tldraw's "Make Real" [3] showed that a UI wireframe sketched on a canvas could be sent to GPT-4V and returned as working HTML/CSS — rendered right next to the original drawing. You could annotate the output, press the button again, and iterate. Code Shaping [4], which won a Best Paper Award at CHI 2025, proved the same pattern on tablets: circle a block of code, draw a chart next to it, draw an arrow showing where the visualization code should go, and AI generates it. Excalidraw [5] added text-to-diagram features, and tldraw's experimental "computer" [6] project turned the canvas into a full programming surface where users wire together AI workflows by connecting visual blocks with arrows. The lesson from all of these: AI doesn't need clean, precise input. A rough sketch carries enough structural information — spatial relationships, containment, direction, relative size — for a model to extract meaning.

**Sketches can communicate motion, not just layout.** A static drawing can convey dynamic intent. SketchDynamics [7], published in January 2026, treats free-form sketches as "semantic expressions of motion intent" — a VLM interprets the motion semantics embedded in how users draw arrows, trajectories, and annotations. Sketch2Anim [8] translates 2D storyboard sketches into 3D character animations through motion diffusion models. Autodesk Research's "Motion Amplifiers" [9] explored the same idea years earlier: sketching dynamic illustrations using principles of 2D animation. The consistent finding is that spatial cues — an arrow's direction, a squiggle implying vibration, a curved path suggesting an arc — carry temporal and behavioral meaning that models can decode.

**Voice and sketch together are more expressive than either alone.** This is the critical insight for motion graphics. TalkSketch [10], a multimodal sketching system accepted at an AAAI 2026 workshop, found that text-based prompting disrupts creative flow during ideation. Their solution: let designers speak while drawing, generating context-aware AI responses from both inputs simultaneously. Designers could "think aloud" while sketching rather than stopping to type prompts. DrawTalking [11], presented at UIST 2024, took this further — users build interactive worlds by sketching elements and narrating their behaviors, giving them "programming-like capability without requiring code." Both systems independently arrived at the same conclusion: concurrent voice and sketch input produces richer, more natural communication of creative intent than either modality alone.

**The rendering pipeline exists.** Remotion [12] turns React components into video frames. This means AI-generated motion code doesn't need to be exported through a manual pipeline — it can render directly to video. The loop from sketch to screen can be closed programmatically.

What's missing is the integration. No existing project combines canvas input, voice narration, and AI interpretation into a pipeline that outputs rendered motion graphics. That's the gap.

![The artist shows a sketch to a robot while talking about it](/assets/images/the-whiteboard-as-the-future-of-computer-interaction/innovation.png)

## What a Sketch-and-Voice Workflow Actually Looks Like

![The artist draws a bird on a whiteboard with arrows showing its flight path](/assets/images/the-whiteboard-as-the-future-of-computer-interaction/workflow.png)

You draw a storyboard on a whiteboard canvas — three or four frames. Frame 1: a title with an arrow showing it sliding in from the left. Frame 2: a bar chart with bars at different heights. Frame 3: the chart shrinks into a corner while a map fades in. You connect the frames with lines showing the sequence.

As you draw, you narrate: "The title comes in fast from the left with a playful bounce. Then these bars grow one by one — give each one a slight delay. Make it feel energetic. Then everything shrinks to the corner and the map fades in slowly, smoothly."

This combination isn't a new behavior for creative professionals — it's an old one brought into a new tool. In traditional animation, scratch audio over storyboards has been standard practice for decades. Animators record rough voice tracks — narration, timing cues, placeholder dialogue — and sync them to storyboard panels to create animatics, timed previews that test pacing before any real animation begins. The workflow proposed here follows the same logic: voice provides the temporal and emotional layer that drawings alone can't efficiently convey. "Playful" and "smooth" imply different easing curves. "One by one with a slight delay" specifies staggered animation. "Fast" and "slowly" define relative timing.

TalkSketch's finding reinforces this: designers naturally "think aloud" while drawing, and capturing that speech produces richer context than post-hoc text annotations. The voice isn't supplementary — it carries the information that matters most for motion: timing, feel, and sequence.

The concrete pipeline would work like this: an open-source canvas (tldraw or Excalidraw) captures the storyboard as a snapshot. A speech-to-text model (Whisper) transcribes the narration with timestamps, aligned to canvas interaction events so the system knows which verbal instructions correspond to which drawn elements. A multimodal LLM interprets both inputs together — the spatial layout tells it what elements exist and how they're arranged; the voice tells it how they should move and feel — and generates Remotion components. Remotion renders a video preview. If something's off, you draw on top of the output, record a correction ("make the bounce less exaggerated, slow down the transition"), and iterate.

Victor's principle sets the bar for this loop: creators need an immediate connection to what they create. Every second of latency between sketching and seeing the result weakens that connection. The pipeline needs to feel like direct manipulation — not a batch job you submit and wait for.

This wouldn't replace After Effects for a professional who needs frame-perfect timing on a broadcast package — that granular control exists for a reason. But it could open motion graphics to the millions of presenters, educators, marketers, and developers who have clear visual intent but will never invest months learning a professional tool. For that audience, the question isn't whether the output is broadcast-quality — it's whether it's good enough to be useful.

## The Prototype and the Challenges It Needs to Solve

![A robot builds a motion graphics canvas while the artist watches](/assets/images/the-whiteboard-as-the-future-of-computer-interaction/prototype.png)

I'm building a prototype of this pipeline: hand-drawn storyboard on a whiteboard canvas, combined with voice narration, interpreted through AI, rendered as a motion graphic. The test is specific: a 15-second explainer animation — title entrance, chart build, transition — turned into rendered video without writing a single line of motion code.

The experiment needs to address several concrete challenges:

**Sketch interpretation reliability.** Current vision models interpret sketches inconsistently. Picard et al. evaluated GPT-4V and LLaVA across visual design tasks with over 1,000 benchmark queries and found significant variability in how VLMs interpret the same visual input [13]. Can the model reliably distinguish an arrow meaning "slide in from the left" from one meaning "this connects to that"? Voice context should help disambiguate — "this slides in" spoken while drawing an arrow clarifies the arrow's meaning — but how much it actually helps is an empirical question.

**Voice-sketch alignment.** Synchronizing what's said with what's drawn is its own challenge. If a user says "make this bouncy" while drawing on frame 2, the system needs to associate that instruction with frame 2, not frame 1 or the overall animation. Timestamped voice transcription aligned with canvas interaction events is the likely mechanism, but the reliability of this alignment is untested.

**Round-trip latency.** Sketching is fast and fluid; waiting for AI responses breaks the flow. KREA's architecture, presented at SIGGRAPH 2024 Real-Time Live!, achieved sub-second response times for real-time AI generation by prioritizing the latest user input over intermediate frames [14]. But most sketch-to-X pipelines still take seconds to tens of seconds per round trip. Victor's principle is the benchmark here: if the feedback isn't immediate enough to feel like direct manipulation, the creative connection breaks.

**Correction mechanisms.** When the AI gets it wrong, users need fine-grained ways to correct course. "Try again" is too coarse. "Move this element 20px left" falls back to structured input. Terry et al. formalize this as "alignment gulfs" — analogous to Norman's classic gulf of execution — where users struggle to specify, steer, and evaluate AI processes [15]. Weisz et al. identify the same tension in their CHI 2024 design principles for generative AI: these models shift control away from users, and current interfaces don't give it back gracefully [16]. The right correction mechanism for a sketch-and-voice interface — something between "redo everything" and "specify numerically" — is one of the things this experiment needs to discover.

**Drawing adoption.** People are used to typing. Asking users to switch to drawing is a behavioral change, and behavioral changes require the new thing to be dramatically — not marginally — better. Voice lowers this bar: even a rough sketch combined with clear verbal instructions might produce better results than either input alone. TalkSketch and DrawTalking suggest this combination is natural for creative tasks. But whether it's compelling enough to change behavior for motion graphics specifically is something only testing with real users will show.

If the prototype works, even partially, it suggests that multimodal input — sketch plus voice — is a viable approach for spatial, creative tasks like motion graphics, and that the components are mature enough to integrate. If it doesn't, the failure modes will point to which of these challenges is the real bottleneck. Either way, I'll write about what I find.

---

## References

[1] Bret Victor. "Stop Drawing Dead Fish." Talk presented at SIGGRAPH 2012 and Dropbox DBX 2013. [Vimeo](https://vimeo.com/64895205) | [worrydream.com](http://worrydream.com/#!/StopDrawingDeadFish)

[2] Bret Victor. "Inventing on Principle." Talk presented at CUSEC, January 2012. [Vimeo](https://vimeo.com/36579366) | [worrydream.com](http://worrydream.com/#!/InventingOnPrinciple)

[3] tldraw. "Make Real: The Story So Far." tldraw's AI-powered sketch-to-code feature using GPT-4V. [tldraw](https://makereal.tldraw.com/) | [GitHub](https://github.com/tldraw/make-real)

[4] Ryan Yen et al. "Code Shaping." CHI 2025 Best Paper Award. University of Waterloo. [ACM](https://dl.acm.org/doi/abs/10.1145/3706598.3713822) | [UW News](https://cs.uwaterloo.ca/news/new-ai-system-turns-sketches-code)

[5] Excalidraw. Open-source text-to-diagram feature using Mermaid syntax. [GitHub](https://github.com/excalidraw/mermaid-to-excalidraw) | [Medium](https://medium.com/@venn5708/excalidraw-open-sources-its-text-to-diagram-feature-3810169df601)

[6] tldraw. "Computer: An Infinite Canvas for Natural Language Computing." Powered by Google Gemini 2.0 Flash. [The Decoder](https://the-decoder.com/tldraw-unveils-experimental-natural-language-computer-powered-by-gemini-2-0/) | [Google AI Showcase](https://ai.google.dev/showcase/tldraw)

[7] SketchDynamics. "An interaction paradigm for sketch-driven motion graphics using VLM-based commonsense reasoning." January 2026. [arXiv](https://arxiv.org/abs/2601.20622)

[8] Sketch2Anim. "Translating 2D storyboard sketches into 3D animations through conditional motion synthesis." SIGGRAPH 2025. [arXiv](https://arxiv.org/abs/2504.19189) | [Project Page](https://zhongleilz.github.io/Sketch2Anim/)

[9] Autodesk Research. "Motion Amplifiers: Sketching Dynamic Illustrations Using the Principles of 2D Animation." [PDF](https://damassets.autodesk.net/content/dam/autodesk/www/autodesk-reasearch/pdf/publications/Motion%20Amphlifiers%20Sketching%20Dynamic%20Illustrations%20Using%20the%20Principles%20of%202D%20Animation.pdf)

[10] Weiyan Shi et al. "TalkSketch: Multimodal Generative AI for Real-time Sketch Ideation with Speech." Accepted at AAAI 2026 Workshop on Creative AI. [arXiv](https://arxiv.org/abs/2511.05817)

[11] Karl Toby Rosenberg et al. "DrawTalking: Building Interactive Worlds by Sketching and Speaking." UIST 2024. [ACM](https://dl.acm.org/doi/10.1145/3654777.3676334) | [arXiv](https://arxiv.org/abs/2401.05631)

[12] Remotion. React framework for programmatic video generation. [Remotion](https://www.remotion.dev/) | [Prompt-to-Motion-Graphics Template](https://github.com/remotion-dev/template-prompt-to-motion-graphics)

[13] Cyril Picard et al. "From Concept to Manufacturing: Evaluating Vision-Language Models for Engineering Design." Artificial Intelligence Review, Springer, 2025. [arXiv](https://arxiv.org/abs/2311.12668) | [Springer](https://link.springer.com/article/10.1007/s10462-025-11290-y)

[14] KREA. "Real-time AI and the Future of Creative Tools." ACM SIGGRAPH 2024 Real-Time Live! [ACM](https://dl.acm.org/doi/10.1145/3641520.3665303)

[15] Michael Terry et al. "Interactive AI Alignment: Specification, Process, and Evaluation Alignment." arXiv:2311.00710, 2023. [arXiv](https://arxiv.org/abs/2311.00710)

[16] Justin D. Weisz et al. "Design Principles for Generative AI Applications." CHI 2024 Conference on Human Factors in Computing Systems. [ACM](https://dl.acm.org/doi/10.1145/3613904.3642466) | [arXiv](https://arxiv.org/abs/2401.14484)
