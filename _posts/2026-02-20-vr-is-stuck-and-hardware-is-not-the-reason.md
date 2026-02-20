---
title: VR is stuck, and hardware is not the reason
author: Sebas
date: 2026-02-20
layout: page
---

![Artist holding a VR headset with a curious uncertain expression](/assets/images/vr-is-stuck/01-intro.png)

Every few years, VR gets another moment. A new headset launches, the demos are impressive, the tech press goes wild. Then six months later, the conversation quietly dies. We blame the hardware: too heavy, too expensive, too low resolution, not enough battery life.

But hardware is not the real problem.

The real reasons VR hasn't taken off are harder to talk about, because they are all content problems: the tools don't exist, the assets don't exist, the creative language doesn't exist. And those three things are connected — each one is partly a consequence of the others.

## The imagination problem is a content volume problem

![Artist sitting at desk staring at a blank screen, defeated](/assets/images/vr-is-stuck/02-imagination-problem.png)

Going from theater to cinema wasn't just about inventing new technology. For the first years of cinema, filmmakers shot stage plays. A static camera, actors entering from the left and exiting to the right. The new medium was there; the new language hadn't been invented yet. That language only emerged after enough people spent enough time making things badly, failing, and learning what the medium could do that no other medium could.

VR is in the same place. Most VR content is either a repurposed game with a headset bolted on, or a 360-degree video where you sit inside a sphere and look around. Neither is native to the medium. Neither uses what makes VR unique: presence, embodiment, spatial depth, the feeling of actually being somewhere.

But the reason that creative language hasn't developed is not that creators lack imagination — it's that so few people can actually make VR content that the experimentation hasn't happened at the scale required. Cinema's grammar was invented by thousands of filmmakers trying things. VR's grammar will be invented the same way, and it hasn't started yet because the barrier to entry was too high.

## The 2D screen paradigm doesn't translate

![Artist confused between a flat 2D screen and a chaotic 3D spatial void](/assets/images/vr-is-stuck/03-2d-vs-3d.png)

Most digital creation happens on a flat screen. Web design, video editing, graphic design, even game development — all of it is oriented around the rectangle. That rectangle is a powerful constraint. It gives you a defined canvas, predictable rules about composition, a shared vocabulary between creator and viewer.

3D breaks all of that. There is no frame. Objects exist in space and have to work from every angle. A background that looks fine from the front might look broken from the side. A UI element that's perfectly readable at one distance becomes overwhelming at another. The spatial relationship between objects matters in ways that 2D creators aren't trained to think about.

This isn't a solvable problem with a better tool. It's a fundamental shift in how you think about space, depth, and the relationship between objects. Most content creators don't have that training, and there isn't yet a simplified version of it that non-specialists can pick up.

## Complexity as a barrier

![Artist overwhelmed by stacked complexity layers — lighting, materials, scale](/assets/images/vr-is-stuck/04-complexity-barrier.png)

Even for people who understand 3D, creating VR content is technically demanding in ways that 2D content is not.

Lighting alone is a discipline. In the real world, light bounces, reflects, casts shadows, changes color as it travels. Replicating that physically requires significant computation or careful artistic approximation. A scene that looks beautiful in a pre-rendered animation can look completely wrong in real time, because the rendering shortcuts that work for video break when the viewer can look anywhere.

Then there's positioning. Objects need to be placed in physical space in a way that makes sense at human scale. A table that looks right in a screenshot might be at the wrong height when you're standing next to it in VR, breaking immersion immediately.

Materials add another layer. The way a surface reacts to light — its roughness, reflectivity, translucency — needs to be physically correct or the scene feels off. Getting this right requires knowledge that artists working in 2D never had to develop.

These aren't unsolvable problems. But they're real, and they raise the minimum skill level required to create something that doesn't look broken.

## The tools are either too hard, too expensive, or too rigid

![Artist furious at a dense cluttered software interface, lock and dollar sign floating nearby](/assets/images/vr-is-stuck/05-tools-hard.png)

If you want to build a VR experience today, your options are roughly: Unity, Unreal Engine, or a web-based option that covers a fraction of the use cases.

Unity became the default because it was more accessible than Unreal and had a large ecosystem of assets and tutorials. But accessible is relative. Unity has a steep learning curve, a complex editor, and a workflow that demands programming knowledge for anything beyond the simplest scenes. Its interface, designed over decades of accumulated features, is dense and often inconsistent — and it was never built with flexibility in mind.

Unreal is more powerful and increasingly capable, but even less accessible. It's a tool designed for large teams building AAA games, not for indie creators or small studios trying to make a VR experience.

On the professional 3D side, the tools are expensive. Maya and Cinema 4D are industry standards, priced for studios that can afford enterprise software licenses. Blender is free and genuinely capable, but it has a learning curve that intimidates most newcomers, and its workflow is not oriented toward real-time or VR content.

Tools like Spline point at a different future: 3D creation in the browser, accessible to designers who know the web, with real-time output that can run anywhere. But Spline is for small scenes and UI work. It's not a VR content creation pipeline.

The gap is wide. On one side, the tools powerful enough to create real VR content are too hard and too expensive. On the other side, the tools accessible enough for most creators can't make what VR needs.

## The asset problem nobody talks about

![Artist skeptically inspecting a pile of mismatched, inconsistent 3D assets](/assets/images/vr-is-stuck/06-asset-problem.png)

Even if you master a tool like Unity, you still need 3D assets: environments, objects, characters, props. In 2D, this is a solved problem. Stock photo libraries, icon packs, video footage — cheap, abundant, consistent in quality, easy to search and license. The ecosystem is mature.

The 3D equivalent is fragmented and immature. Sketchfab, Turbosquid, and similar marketplaces exist, but the quality is wildly inconsistent, the licensing is confusing, and finding an asset that matches your scene's style and scale is genuinely difficult. Unlike a stock photo that you drop in and it works, a 3D asset often needs to be retextured, rescaled, optimized for real-time rendering, and adapted to your lighting setup. What looks like a shortcut can cost more time than building from scratch.

This matters because content volume requires a supply chain. Web content exploded when stock photography, template marketplaces, and CMS tools made it possible for one person to produce something that looked professional. VR content needs the same infrastructure, and it doesn't have it yet.

## How AI changes the equation

![Artist cautiously optimistic at his desk, AI generating 3D objects on screen](/assets/images/vr-is-stuck/07-ai-start.png)

Every barrier described in this article is a content and creation problem. Not a physics problem, not a chip problem. And the AI solutions map cleanly onto the problems: generative models that create the raw material, language models that augment the creator's workflow, and world models that represent a longer-term shift in what content creation even means.

### Generative AI: creating the raw material

The most direct barrier was scarcity — of assets, of environments, of motion data, of technically correct materials. Generative AI addresses all of these by producing content from description rather than requiring it to be built or found.

3D asset generation has gone from research demo to usable pipeline in two years. Tools can now produce textured, game-ready objects from a text prompt or a single image, with quality improving fast enough that outputs increasingly require no cleanup before use. For environments, NeRF and Gaussian Splatting techniques reconstruct photorealistic 3D scenes from a phone video walkthrough — what previously required expensive photogrammetry rigs is now a mobile app. Textures and physically accurate surface materials are increasingly generated from a description or reference image, replacing a craft that previously took years to develop.

Generative scene systems like Text2Room and LucidDreamer extend this to full spatial environments: you describe a space and receive navigable 3D geometry — not a flat render, but a space you can move through, with coherent depth and structure. Character animation follows the same pattern: a smartphone recording of someone moving can now be converted into usable motion capture data, with auto-rigging tools handling the structural setup that used to take animators hours per character.

The shift is structural. Assets stop being something you find, adapt, and compromise on. They become something you specify and receive on demand — at every level of the pipeline.

### LLMs: augmenting the creator's workflow

Where generative AI creates content, language models augment the creator. The two problems they address most directly are the programming barrier and the knowledge gap.

The programming layer — interactions, physics, controller input, scene logic — excluded anyone without a software background from building anything interactive. LLMs change this. You can describe what you want an object to do and get working Unity C# or Three.js code back. You can ask for a script that batch-converts assets between formats, configures spatial audio, or handles locomotion. Beyond code, LLMs are increasingly useful as workflow agents: processing and translating assets from mismatched sources, adapting geometry between pipelines, and handling the tedious conversion work that previously required either a developer or hours of manual effort.

This doesn't eliminate the programming barrier entirely — complex interactive experiences still require someone who understands the stack — but the threshold of what a non-developer can build has risen significantly.

The knowledge gap is the other side of the same problem. Blender has thousands of features and a workflow that took experienced users years to internalize. Unity's documentation assumes a programming background. An AI system grounded in the relevant documentation can now answer exactly how to set up a PBR material for real-time rendering, how to optimize a scene for the Quest's performance budget, or what scale a door should be in VR — giving a precise, contextual response instead of requiring hours of documentation search. The learning curve compresses. For a medium where the knowledge gap was wide enough to block entry, that compression matters.

## What happens next

![Artist wearing VR headset, arms outstretched with joy, surrounded by a vibrant virtual world](/assets/images/vr-is-stuck/08-ai-end.png)

The content explosion is coming before the hardware is ready. Headset roadmaps from Apple, Meta, and Sony are measured in years. AI tooling for 3D content creation is moving in months. Meshy, one of the more widely used AI 3D asset generators, reported over a million registered users by late 2024 — a creator base that didn't meaningfully exist two years prior. We may reach a point where there is more VR-ready content than there are comfortable, affordable headsets to consume it — the first time in the history of the medium that the supply problem flips.

And as that content arrives, so does the creative language. The grammar of VR — the native storytelling techniques that no other medium can replicate — will not be designed in advance by theorists. It will be discovered by the thousands of creators who, for the first time, can actually afford to experiment. The imagination problem was always a volume problem. Lower the barrier enough and the experimentation begins. Lower it far enough and someone figures out what VR is really for.

That abundance, arriving ahead of schedule, is what will finally pull hardware adoption over the threshold. Not a killer app announced at a keynote. A quiet flood of experiences made by people who, six months earlier, could not have made them.

## References

- [Spline](https://spline.design/) — Browser-based 3D design tool
- [Unity](https://unity.com/) — Real-time 3D development engine
- [Unreal Engine](https://www.unrealengine.com/) — AAA game engine, increasingly used for VR
- [Blender](https://www.blender.org/) — Free and open-source 3D creation suite
- [Cinema 4D](https://www.maxon.net/cinema-4d) — Professional 3D modeling and animation
- [Sketchfab](https://sketchfab.com/) — 3D asset marketplace
- [Turbosquid](https://www.turbosquid.com/) — 3D model marketplace
- [Luma AI](https://lumalabs.ai/) — NeRF and Gaussian Splatting 3D scene capture from video
- [Meshy](https://www.meshy.ai/) — AI 3D asset generation from text or image
- [Tripo3D](https://www.tripo3d.ai/) — AI 3D asset reconstruction from a single image
- [Shap-E](https://github.com/openai/shap-e) — OpenAI's text/image to 3D model
- [Polycam](https://poly.cam/) — Mobile 3D scanning using LiDAR and photogrammetry
- [Adobe Substance 3D](https://www.adobe.com/products/substance3d.html) — AI-assisted material and texture generation
- [Text2Room](https://lukashoel.github.io/text-to-room/) — Full room 3D scene generation from text
- [LucidDreamer](https://luciddreamer-cvlab.github.io/) — Consistent 3D scene generation from text
- [Google Genie 2](https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/) — Interactive 3D environment generation from a single image
- [World Labs](https://www.worldlabs.ai/) — Spatial intelligence and 3D world generation
- [Oasis](https://oasis-model.github.io/) — Real-time generative world model (Minecraft)
- [Move AI](https://www.move.ai/) — Markerless motion capture from video
- [DeepMotion](https://www.deepmotion.com/) — AI animation from video footage
- [Mixamo](https://www.mixamo.com/) — Adobe auto-rigging and animation for 3D characters
- [Cursor](https://www.cursor.com/) — AI-powered code editor
- [GitHub Copilot](https://github.com/features/copilot) — LLM-assisted code generation
