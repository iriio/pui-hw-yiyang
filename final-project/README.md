<mark>**Note that this document order from FP4 -> FP1**</mark>

<mark>Please sign up for the study</mark> at [https://tinyurl.com/pui-study](https://tinyurl.com/pui-study) to allow us to use your submission to create a better GenAI assistant for designers!

---

# **FP4 \- Final Project Writeup**

Feel free to refer to this [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/) to make your writeup more organized, and you can preview your markdown file in VSCode [Markdown editing with Visual Studio Code](https://code.visualstudio.com/docs/languages/markdown#_markdown-preview).

## Part 1: Website Description

Describe your website (300 words).

- What is the purpose of your website?
- Who is the target audience?
- What information do you convey with your website?
- How is it interesting and engaging?

## Part 2: User Interaction

How a user would interact with your website? For each step, briefly but clearly state the interaction type & how we should reproduce it.

1. Interaction type. Click on X on page Y / scroll on page X, etc.
2.

## Part 3: External Tool

Describe what important external tool you used (JavaScript library, Web API, animations, or other). Following the bulleted list format below, reply to each of the prompts.

1. Name of tool1
   - Why did you choose to use it over other alternatives? (2 sentences max)
   - How you used it? (2 sentences max)
   - What does it add to your website? (2 sentences max)
2. Name of tool2

## Part 4: Design Iteration

Describe how you iterated on your prototypes, if at all, including any changes you made to your original design while you were implementing your website and the rationale for the changes. (4-8 sentences max)

## Part 5: Implementation Challenge

What challenges did you experience in implementing your website? (2-4 sentences max)

## Part 6: Generative AI Use and Reflection

Describe how you used Generative AI tools to create this final project (fill in the following information, write \~500 words in total).

Document your use of all GenAI tools — ChatGPT, Copilot, Claude, Cursor, etc. using the template below. Add/Delete rows or bullet points if needed, and replace Tool1/Tool2 with the name of the tool.

### Usage Experiences by Project Aspects

Feel free to edit the column \_ (other?) or add more columns if there's any other aspect in your project you've used the GenAI tools for.

For the following aspects of your project, edit the corresponding table cell to answer:

- _Usage_: Whether you used / did not use this tool for the aspect. Enter [Yes/No]
- _Productivity_: Give a rating on whether this tool makes your productivity for X aspect [1-Much Reduced, 2-Reduced, 3-Slightly Reduced, 4-Not Reduced nor Improved, 5-Slightly Improved, 6-Improved, 7-Much Improved].

| Tool Name | Ratings      | design | plan   | write code | debug  | \_ (other?) |
| :-------- | :----------- | :----- | :----- | :--------- | :----- | :---------- |
| Tool1     | Usage        | Yes/No | Yes/No | Yes/No     | Yes/No | Yes/No      |
| Tool1     | Productivity | 1~7    | 1~7    | 1~7        | 1~7    | 1~7         |
| Tool2     | Usage        | Yes/No | Yes/No | Yes/No     | Yes/No | Yes/No      |
| Tool2     | Productivity | 1~7    | 1~7    | 1~7        | 1~7    | 1~7         |

### Usage Reflection

> Impact on your design and plan

- It matched my expectations and plan in [FP2](#generative-ai-use-plan) in that … For example,
  1. Tool1:
  2. Tool2:
- It did not match my expectations and plan in [FP2](#generative-ai-use-plan) in that … For example,
  1. Tool1:
  2. Tool2:
- GenAI tool did/did not influence my final design and implementation plan because … For example,
  1. Tool1:
  2. Tool2:

> Use patterns

- I accepted the generations when … For example,
  1. Tool1: this tool once suggested … and I adjusted my design according to the suggestion because …
  2. Tool2:
- I critiqued/evaluated the generated suggestions by … For example,
  1. Tool1: this tool once suggested … but I modified/rejected the suggestion because …
  2. Tool2:

> Pros and cons of using GenAI tools

- Pros
  1. Tool1:
  2. Tool2:
- Cons
  1. Tool1:
  2. Tool2:

### Usage Log

Document the usage logs (prompts and chat history links) for the GenAI tools you used. Some tools may not have an easy way to share usage logs, just try your best! Some instructions for different tools:

1. [ChatGPT](https://help.openai.com/en/articles/7925741-chatgpt-shared-links-faq) / [Gemini](https://support.google.com/gemini/answer/13743730?hl=en&co=GENIE.Platform%3DDesktop): share the anonymous link to all of your chat histories relevant to this project
2. [GitHub Copilot (VSCode)](<https://code.visualstudio.com/docs/copilot/copilot-chat#:~:text=You%20can%20export%20all%20prompts%20and%20responses%20for%20a%20chat%20session%20in%20a%20JSON%20file%20with%20the%20Chat%3A%20Export%20Session...%20command%20(workbench.action.chat.export)%20in%20the%20Command%20Palette.>): export chat histories relevant to this project.

---

# **FP3 \- Final Project Check-in**

Document the changes and progress of your project. How have you followed or changed your implementation & GenAI use plan and why? Remember to commit your code to save your progress.

## Implementation Plan Updates

- [ ] ...

## Generative AI Use Plan Updates

- [ ] ...

Remember to keep track of your prompts and usage for [FP4 writeup](#part-6-generative-ai-use-and-reflection).

---

# **FP2 \- Evaluation of the Final project**

## Project Description

This project is a web-based synthesizer interface that allows users to experiment with sound generation and modulation through an intuitive, interactive layout. My motivation is to create a visually engaging, functional synthesizer that mimics the look and feel of physical synthesizers, enabling users to manipulate sound parameters directly on screen.

## High-Fi Prototypes

### _Prototype 1_

![Interface elements](images/prototype1.png)

Prototype 1 focuses on the individual interface elements I plan to use in the synthesizer, including sliders, knobs, screens, graphics, and keys. These components establish the essential controls that users will interact with to adjust sound parameters. Initial feedback emphasized the importance of making each element responsive and visually intuitive to enhance usability, as well as some issues with accessibility.

### _Prototype 2_

![Interface mockup](images/prototype2.png)
Prototype 2 shows how the elements from Prototype 1 can come together into a cohesive interface. This mockup demonstrates a possible layout, showing how controls like oscillators, envelopes, and filters are organized. Feedback on this prototype suggested refining the layout for clarity and ease of use, as well as adding visual indicators for how to start using these controls, possible presets, etc.

## Usability Test

During usability testing, users appreciated the overall layout but suggested that certain controls, particularly sliders and buttons, could be more responsive and precise. Improving the visual feedback when adjusting parameters like oscillators and filters, to make it clearer which settings are active.

Some users found it challenging to distinguish between the effects of different controls, indicating that clearer labeling or tooltips could improve usability. Additionally, users proposed adding a feature that shows a visual waveform in real-time, which I have already added in the prototype above since this feedback came before that, to help them understand how their adjustments impact sound.

## Updated Designs

![refined mockup](images/prototype-refine.png)
The updated design included some presets where user can simply click on a button and experience the change in sound, as well as a reset button to put everything back to default. A recording functionality is in consideration given the feedback, though actual implementation might differ depending on the complexity & if an export need to be included with this feature.
This update also included a pop-up tooltip to inform users of the keybaord control feature.
Smaller updates also include a bolder font size overall, and slight adjustments to the color, though the color palette still needs refinement to align with accessibility standards.

## Feedback Summary

In the lab session, feedback focused on making the interface more accessible and intuitive, particularly by improving the slider and button responses. People said that the visual feedback for active controls made the synthesizer more engaging and easier to use. Some suggestions involved further refining the control layout for different screen sizes to ensure that the synthesizer remains usable on various devices, as well as possibilities to make it even simpler to cater to a wider audience.

## Milestones

### _Implementation Plan_

- [x] **Week 9 Oct 28 - Nov 1**:
  - [x] FP1 due
  - [x] Complete Hi-Fi prototype 1 usability testing and iterate based on feedback.
- [x] **Week 10 Nov 4 - Nov 8**:
  - [x] FP2 due
  - [x] Begin final design adjustments and integrate visual feedback enhancements.
- [ ] **Week 11 Nov 11 - Nov 15**:
  - [ ] Implement responsive design elements for different screen sizes.
  - [ ] Refine the interaction for sliders and buttons.
- [ ] **Week 12 Nov 18 - Nov 22**:
  - [ ] Finalize integration of visual waveform display.
  - [ ] Conduct additional usability tests for refined interactions.
- [ ] **Week 13 Nov 25 - Nov 29**:
  - [ ] Thanksgiving break; refine documentation and gather final feedback.
- [ ] **Week 14 Dec 2 - Dec 6**:
  - [ ] FP4 due
  - [ ] Final testing and debugging before project presentation.

### _Libraries and Other Components_

- **Tone.js**: For audio synthesis and sound manipulation.
- **Anime.js**: For smooth animations on interactive elements.
- **Three.js**: For potential 3D visualizations of the waveform.

## Generative AI Use Plan

### _Tool Use_

- **ChatGPT**: I will use ChatGPT for code suggestions and troubleshooting, especially for JavaScript syntax and interactive features. It can help me brainstorm and implement complex features but might not be effective in testing or debugging highly specific synthesis code.
- **GitHub Copilot**: Useful for autocompleting code based on context, speeding up coding, especially for repetitive tasks. However, I will avoid using it for sensitive data input to ensure responsible use.

### _Responsible Use_

I will use Generative AI responsibly by verifying all AI-generated code and ideas before actually implementing them, ensuring that the suggestions align with the project’s accessibility and usability goals. I will also document the AI assistance to maintain transparency regarding its role in my project.

---

# **FP1 \- Proposal for Critique**

## Idea Sketches

### _Idea 1_

![horizontal scroll portfolio](images/sketch1.jpg)

The basic idea for this project is to create a unique, visually engaging portfolio using a horizontal scroll layout to showcase work, skills, and interests in a non-traditional format. The interactivity will focus on smooth transitions between sections, using animations to highlight project details.
Accessibility features will include keyboard navigation and alt text for images, and the goal is to convey both technical skills and personal branding through an intuitive, scroll-based experience.

### _Idea 2_

![synth keyboard](images/sketch2.jpg)
This idea is to design an interactive synth keyboard site where users can experiment with sound synthesis and visualization, exploring different sounds and effects in real time.
Engaging elements will include interactive keys, sliders and other fun UI elements for sound adjustments, and real-time audio-visual feedback. Accessibility features might include large, touch-friendly controls for mobile and clear labels on each interactive element to support screen readers.

### _Idea 3_

![color contrast game](images/sketch3.jpg)
This game concept is more on teaching users about web accessibility principles, especially color contrast. Players will have mini-games like choosing the correct color contrast for readability and adjusting elements to ensure accessibility.
The game will be accessible itself, with high-contrast visuals, keyboard navigation, and audio cues to help players understand and apply accessibility standards.

## Feedback Summary

1. **Horizontal Scroll Portfolio**:

   - **Strengths**: People found the horizontal layout visually interesting and agreed it would make the portfolio stand out from typical vertical scroll formats. The plan to incorporate minimum animations for transitions to ensure cleanliness and accessibility received positive feedback.
   - **Concerns**: However, some raised concerns about usability, particularly on mobile devices, where horizontal scrolling can feel unintuitive. Additionally, the challenge of making the site accessible for users who rely on keyboard navigation is challenging. Some suggested that an alternative navigation option, like a skip-to-section thing, can improve accessibility.

2. **Synth Keyboard Website**:

   - **Strengths**: This idea got the most feedback on the creativity end, as to its potential to engage users with interactive sound manipulation. The feedbacks I got emphasized how the project could demonstrate both front-end skills and a unique audio component. Many felt that a real-time sound visualizer would be exciting, with some suggesting that there could be a lot of visual elements to play with since the UI would be fairly straightforward.
   - **Concerns**: The main concern here was about technical feasibility and performance optimization, as real-time audio processing can be demanding.

3. **Educational Game on Accessibility and Contrast**:
   - **Strengths**: They appreciated the game’s educational value and though it's an impactful way to engage users in learning about accessibility. The simple, quiz-style interaction was seen as user-friendly, and the focus on accessibility directly aligned with important web standards.
   - **Concerns**: While the game idea got good critiques, people have some doubts on how engaging it could be in practice, because the concept felt less interactive and dynamic than the other two. Some suggested adding more game-like elements, such as levels or rewards, to get more user motivation. People also recommended making sure it didn’t feel too similar to existing accessibility tools or games.

## Feedback Digestion

After considering the feedback, I’m leaning toward the Synth Keyboard Website for my final project. The horizontal scroll portfolio is visually unique, but feedback pointed out that horizontal scrolling can feel awkward on mobile, where people are used to a vertical layout. While I could add alternative navigation, that would make the site more complex than intended, and I’d prefer to keep things clean and intuitive.

The accessibility game idea has a lot of educational value, but some thought it might need extra interactive features—like levels or rewards—to keep people engaged. While these additions would make the game more dynamic, they’d also increase the scope, potentially making the project more challenging to execute effectively within the time I have since there are far more level design to do than actual implementation.

The Synth Keyboard Website feels like the right fit because it brings together UI design and audio elements in a fun, visually engaging way. I’ll keep the feedback about performance in mind, especially since real-time audio can be tricky. Using Tone.js should help keep things lightweight and manageable, and I’ll start with a simpler sound set to ensure smooth performance.
