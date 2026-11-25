# Qubix 0.1.4 — offline classroom quizzes

Qubix runs on a Windows teacher laptop. Individual players use phone browsers on the same local Wi-Fi. Shared-screen team games run entirely on the laptop. The installed app needs no Node.js, student app, account, paid hosting, or internet connection.

## Current Windows release

The app, browser tabs, exports and Windows executable use the Qubix name with no prerelease badge. The Violet layout includes a sticky top navigation, horizontal quiz cards, animated Full mix backgrounds, a Newton's cradle and floating, draggable student avatars. Local music, photos, five-second preparation and reading stages, rankings, results and all sixteen team games are included.

Close the earlier application before opening Qubix, then reload student pages. On first launch, Qubix copies the earlier desktop data directory when no Qubix data directory exists. The previous database and photos remain untouched. Existing Qubix data takes precedence and is never merged or overwritten. The database becomes `qubix.sqlite`; older database filenames remain readable for migration. Browser settings and sessions also migrate when accessed on the same browser origin.

Test the Windows app on the teacher's laptop and intended classroom network before final handover.

## Try the Windows app

1. Open `release/Qubix-0.1.4-Windows.exe`.
2. Choose **Host game** on the included quiz.
3. Choose **Everyone’s in** for individual phone play, or **Better together** for shared-screen teams.
4. For phones, connect every device to the same classroom Wi-Fi. Open **Setup & connection**, use the displayed student address or QR code, and enter the room’s six-digit PIN.
5. Start the game. Read the question, answer, watch the rankings, and continue to the next question. Results save automatically at the end.

Team play: select a game and enter 2–8 team names (exactly two for Tic Tac Toe, Four in a Row and Soccer). Follow the board’s controls, judge spoken answers, and watch the rankings between turns. Games use their own score units; see [Team games](TEAM-GAMES.md). Individual correct answers earn 500–1,000 points based on time remaining.

Each question begins with a shared five-second Get ready countdown and progress bar while the question remains hidden. Next, a five-second reading stage shows the prompt and optional photo before answer choices appear. The full answer time starts afterward. Answer tiles enter in sequence, locked answers and correct-answer feedback animate, leaderboard rows move into their new positions, and the final podium has a short confetti celebration. Use **Animations on** in the header to switch to reduced motion on that device; the app also respects the device’s reduced-motion preference. All effects work offline.

Workspace pages and quiz-editor question tabs also have short crossfades. Typing and live score updates do not replay them.

This initial development build is unsigned. It has not been tested with 50 physical phones. Use a suitable access point and run a classroom pilot before promising that capacity.

## Question images

Qubix supports one optional image per question, across all subjects. In the quiz editor, use **Add image** below the question text to upload a JPG, PNG, or WebP file up to 10 MB. Images are resized to a maximum edge of 1,600 pixels and stored locally, up to 2 MB each. Add an optional description, replace or remove an image, and open its preview with zoom controls.

Teacher and student screens show the same image during reading, answering, and reveal in both play modes. Images use cached local URLs instead of being resent with score updates. Quiz backups include the referenced images, and Qubix can import older text-only backups. Image backups may be up to 40 MB.

## Avatars and round rankings

Qubix uses dark purple surfaces across the teacher workspace, editor, dialogs, and student screens. Ten supplied avatars are bundled locally. The host assigns avatars randomly without repeating until all ten have been used, then starts a fresh random pool. Reconnection preserves each player's avatar, and finished results retain it. Teams receive random avatars as well.

After the Get ready countdown, each question shows its prompt and optional image with a five-second reading progress bar. Answer choices stay hidden, and the full answer timer starts afterward. Individual play reveals answers when everyone has answered, when time runs out, or when the teacher reveals early. After 2.5 seconds of feedback, an animated top-five ranking screen counts up points and moves players to their new positions. Students also see their own rank and points gained. The teacher can continue after the ranking animation's minimum five-second display. Very short student screens show the top three plus the student's own rank. Team play shows rankings after Correct or Missed it, then returns to the board or opens the final podium. Reduced motion displays final scores immediately while preserving the game stages.

Rankings use slower point counting, trophy artwork and compact student layouts.

## Offline music

The supplied eight-track music pack is included locally. The Quiz library plays Lobby Bounce after the first click or a tap on Enable sound. Teacher music then changes with the lobby/team board, question reading, answering, rankings, and final podium. The last five seconds use a deadline-aligned countdown sound. Students hear their own correct/wrong result after the answer is revealed. Teacher and student sound defaults to on at 100%, with Background music and Game sounds enabled. Shared-screen team awards play correct/wrong effects on the teacher's laptop.

Use the speaker button to enable or mute sound, and the adjacent Sound settings control to adjust volume, Background music, and Game sounds independently. These preferences are saved per device, with separate teacher/student settings. Clicking in the teacher workspace, joining, answering, or tapping Enable sound activates browser playback. A page reload or device interruption may require another tap. Library music resumes when returning from Live room. Results, Setup & connection, and an empty Live room are silent. Sound also stops on disconnection or when hiding the page. Reconnection resumes music without replaying old feedback. Audio loading and playback failures do not affect scoring or game progression.

Audio files are served over the same local Wi-Fi as the rest of the game; internet access is not required. The library, game lobby and game stages include local music and sound controls.

## Countdowns and classroom celebrations

A separate five-second Get ready countdown appears before every question in both modes. A progress bar and avatar mascot appear while the prompt, photo, and choices remain hidden. The five-second question-reading stage follows, then the full answer timer begins. Preparation and reading deadlines come from the server and survive reconnection.

When a new student joins, the teacher, existing students, and joining student see a brief avatar welcome inside the roster or student waiting card. The joining student gets a personal welcome. One arrival is highlighted at a time, can be dismissed, and fades away automatically after 4.2 seconds. Reconnecting does not announce a new arrival. Game screens use a short bounce and sparkle entrance with a fade-out of the previous stage; score updates and timer ticks do not replay it. Countdown digits also fade between values. The shared reduced-motion setting disables decorative movement while preserving progress and game timing.

Countdowns, classroom celebrations, panel welcomes and fade-outs are included. After updating the teacher's app, reload student pages before joining the new room so they receive the current interface.

## Data and recovery

Desktop data is stored in `%APPDATA%/Qubix/data/qubix.sqlite` (the exact application folder can vary by Electron environment). Command-line mode uses `data/qubix.sqlite` in the project directory. Override the CLI directory using `QUBIX_DATA_DIR`; override the CLI port with `PORT`.

Use **Back up** in the library to export quizzes to JSON. **Import** adds copies of quizzes from a Qubix backup. Results export as CSV. Quiz backups do not include result history; to move all data, close the application and copy the entire data folder, including `qubix.sqlite` and its `images/` directory, to the new application data folder.

Quizzes and finished results survive an app restart. An unfinished live room is held in memory and does not survive the host application closing, the laptop restarting, or a crash. Keep the laptop awake. A student can reconnect during a running game with the same browser tab; identity is held in that tab’s session storage. A new tab, cleared browser storage, or a new host session can require rejoining before the game starts.

## Classroom network checklist

- Laptop and phones share a reachable local network. The router needs power, but no internet subscription.
- Allow the application through Windows Firewall on the trusted private classroom network when asked. The application does not change firewall rules automatically.
- Disable guest/client isolation through the school’s approved network configuration if it prevents reaching the host. A working same-Wi-Fi connection alone does not prove device-to-device access.
- Keep phones on Wi-Fi if they report “no internet.” Keep the laptop awake and connected throughout the game.

For an Android hotspot, connect the laptop and every student phone to that same hotspot. The hotspot network must allow the devices to communicate locally. In Setup, choose the laptop's address on that network. A page opening on the laptop itself verifies the local server, but does not verify access from phones.

If both the hotspot phone and a second connected phone time out while the laptop opens its student address, check the laptop's inbound firewall permissions and active network profile. With the portable build, verify permissions for the currently running Qubix.exe: its extracted temporary path can differ from earlier runs. Use the trusted classroom network profile and the application-specific permission. The app does not configure these Windows settings. A third-party firewall or hotspot access restriction may also need investigation.

VPN software can apply its own network filters independently of the Windows Firewall app exception. Cloudflare WARP blocked local phone connections in a confirmed hotspot test; disconnect WARP on the hosting laptop for offline play, or use its local-network access option if your client provides one. Keep Windows Firewall enabled.
- Test a phone first, then several phones, then the intended full class. Router client limits and radio conditions vary.
- Teacher access uses a fresh secret on every startup. Do not share the private teacher URL. Only the `/join` address and game PIN should be shared with students.
