# Sleeping Forest

![](https://gitlab.com/winterwildfire/ue4/trailblazer/badges/master/pipeline.svg)
![](https://img.shields.io/badge/4.24%20--%204.24-supported-green)
[![](https://img.shields.io/discord/573495259926102017)](https://discord.gg/8Qd8a66)
![](https://img.shields.io/badge/platform-windows-lightgrey)
![](https://img.shields.io/badge/replication-not%20supported-red)

[![Website](https://api.netlify.com/api/v1/badges/e3c2b5de-423f-417f-b57b-73d48f9e9c3f/deploy-status)](https://suvam0451.netlify.com/docs/trailblazer/getting-started)

**Sleeping Forest** is a VSCode extension for _Unreal Engine 4_ that provides powerful **code-completion and command-line features** for programmers and **asset management/optimization tools** for designers.

This extension is primarily for. **Multiplayer is not supported yet.**

Note that this teh plug-in is **currently in beta** and undergoing improvements. If you want to tag along and suggest features, join [my discord](https://discord.gg/8Qd8a66) to help build the best gamedev plug-in for vscode !!!
As of now, only Windows support is available for micro-services.

## Installation

To install through VS Code extensions, Search for `Sleeping Forest - UE4 Multitool`

To get the beta releases/requested patches, visit the [website](https://suvam0451.netlify.com/docs/trailblazer/getting-started/)

## Key Features

- Improved Intellisense
- 200+ snippets
- Context aware custom auto-completion
- file/function/header generation/management
- Asset management via asset streams
- Command line shader/game/code compilation support
- Modding support for most modules
- Various micro-service integrations
- Support for writing UE4 HLSL shaders [Planned]

## Documentation

- [Getting Started](https://suvam0451.netlify.com/docs/trailblazer/getting-started/)
- [Context binding overview](https://suvam0451.netlify.com/docs/trailblazer/context-keys/)
- [Asset streams overview](https://suvam0451.netlify.com/docs/daedalus/hello-asset-streams)
- [Modding/Customizing guide](https://suvam0451.netlify.com/docs/trailblazer/extension-files)


## Features

### Better intellisense

Configurable setting to override configuration in the .code-workspace file for better search results and faster overall performance. *(Your experience may vary)*

![workspace file](https://i.imgur.com/N6ImaLr.gif)

### Contextual auto-completion

150+ snippets and counting.
Constantly updated support towards smart auto-completion at generic/repetitive blocks of code as shown below.
(**// context keyword** after macro usage). Learn more abotu [context key](https://suvam0451.netlify.com/docs/trailblazer/context-keys/)

![Fast hit trace](https://i.imgur.com/6003uFY.gif)

![More in docs](https://suvam0451.netlify.com/docs/trailblazer/context-keys/)


### Class/Header/Function generation

Commands to add templated class files, headers from inside (.h/.cpp) files and automatically adding common functions liek BeginPlay in (.h/.cpp).
These features can be customizing by your own JSON definitions. [See more...](https://suvam0451.netlify.com/docs/trailblazer/extension-files)

![header module](https://i.imgur.com/6758foW.png)
![function defs](https://i.imgur.com/XZPWFCg.gif)

Also, support for
- **Class generation** for Actors, ActorComponents. [More...]()
- Contextual constructors for Component properties

# Micro services(currently only for windows)

The following service tools are currently available for **windows only**. Convenient way to optimize, update and manage assets through concept of asset streams.

### Batch export tool

Assembles information about raw assets in tagged **asset-stream folders** and produces a python file which can be used in UE4 to automatically
import all assets into respective folder structure and settings using python API.

### Texture Packing tool

Able to pack different types of textures into RGBA channels of a single mega texture. This is the feature being currently worked on. Fully supports asset stream workflow.
Supported import extensions are { jpg, tiff, png }, supported output extensions are png and jpg with quality settings

![](https://i.imgur.com/i8L4djk.gif)


### Asset Audit tool

Every folder is inside an asset stream is scanned and indexed in JSON files. These can be imported into UE4 directly for data driven gameplay elements.

# Disclaimer

I work on this extension in my free time. Community collaboration is very important to me. Please consider joining my discord and suggesting improvements.
It is recommended you use it on casual projects. The project is undergoing rapid progress and we don't want remnant bugs to break anything.
**Stability will be guaranteed post 1.0.0 launch.**

You are free to tag along. I would love to hear what you improvements you have in mind.