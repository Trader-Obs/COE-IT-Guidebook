/*
  IT Guidebook - troubleshooting data
  -----------------------------------
  Each problem has a set of nodes. There are three kinds of node:

    q     a yes / no question:   { t:"q", text, hint?, yes:"id", no:"id" }
    step  something to try:      { t:"step", text, ok:"id", fail:"id" }
          (ok = "That fixed it", fail = "Still not working")
    end   a result:              { t:"end", status:"fixed" | "report", title, text }

  Every problem starts at the node called "start". To add a problem, copy one block,
  give it a new id, and add an icon name from ICONS in app.js.
*/

window.CONTACT = {
  unit: "ICT Unit, College of Education, Warri",
  how: "Visit the ICT unit office or tell the staff in charge of your lab or room."
};

window.PROBLEMS = [
  {
    id: "power", icon: "power",
    title: "Computer will not start",
    blurb: "No lights, no picture, or it stops before the login screen.",
    keywords: "power on boot start dead black screen fan light switch laptop desktop",
    nodes: {
      start: { t: "q", text: "When you press the power button, do any lights or fans come on?", yes: "screen", no: "cable" },
      cable: { t: "q", text: "Is the power cable pushed in firmly at the computer and at a working wall socket?", hint: "For a laptop, check the charger and the charging light.", yes: "extension", no: "fixcable" },
      fixcable: { t: "step", text: "Push the cable in firmly at both ends. Then press the power button again.", ok: "fixed", fail: "extension" },
      extension: { t: "step", text: "Check the switch on the extension box and try another socket. Plug a phone charger into the same socket to see if it has power. For a laptop, leave the charger on for 5 minutes before you press power.", ok: "fixed", fail: "ereport" },
      screen: { t: "q", text: "Does the monitor show a picture?", yes: "login", no: "monitor" },
      monitor: { t: "step", text: "Check that the monitor's own power light is on and the video cable (HDMI or VGA) is firm at both ends. Press the monitor's input button and choose the input that matches the cable.", ok: "fixed", fail: "ereport" },
      login: { t: "q", text: "Does the computer reach the login screen?", yes: "okdone", no: "restart" },
      restart: { t: "step", text: "Hold the power button for 10 seconds until it switches off. Wait 30 seconds, then start it again. If you see a disk error or repair screen, stop and do not keep pressing keys.", ok: "fixed", fail: "ereport" },
      okdone: { t: "end", status: "fixed", title: "The computer is working", text: "It reaches the login screen, so the start-up problem is gone. If it happens again, note what you saw on the screen and tell the ICT unit." },
      fixed: { t: "end", status: "fixed", title: "Problem solved", text: "Good. If the same fault comes back, report it, because it may be a loose part or a failing power supply." },
      ereport: { t: "end", status: "report", title: "Report this to the ICT unit", text: "The basic checks did not fix it, so the fault may be inside the computer or the power supply. Please do not open the computer yourself." }
    }
  },
  {
    id: "internet", icon: "wifi",
    title: "No internet",
    blurb: "Pages will not open, or Wi-Fi or the network cable will not connect.",
    keywords: "wifi wi-fi network connection online browser cable lan offline dns ping",
    nodes: {
      start: { t: "q", text: "Do other devices nearby (your phone or another computer) have internet?", yes: "linked", no: "ewide" },
      ewide: { t: "end", status: "report", title: "Likely a network problem, not your computer", text: "If other devices are also offline, the fault is probably in the network equipment or the internet supply. Tell the ICT unit which room or lab is affected." },
      linked: { t: "q", text: "Is Wi-Fi switched on (and airplane mode off), or is the network cable pushed in firmly?", hint: "On a cable, a small light should blink at the socket.", yes: "connected", no: "turnon" },
      turnon: { t: "step", text: "Turn Wi-Fi on and airplane mode off, or push the network cable in until it clicks. Wait 30 seconds.", ok: "fixed", fail: "connected" },
      connected: { t: "q", text: "Does the computer say it is connected, but websites will not open?", yes: "ping", no: "forget" },
      forget: { t: "step", text: "Forget the Wi-Fi network, then connect again and re-enter the password carefully. For a cable, try another socket or another cable.", ok: "fixed", fail: "ping" },
      ping: { t: "step", text: "Open Command Prompt and type: ping 8.8.8.8 and press Enter. If you get replies, the internet works and the problem is the browser or name lookup: try a different browser, then type ipconfig /flushdns. If it says Request timed out, the connection is not reaching the internet.", ok: "fixed", fail: "ereport" },
      fixed: { t: "end", status: "fixed", title: "Back online", text: "Good. If it drops again, write down the time and the room so the ICT unit can look for a pattern." },
      ereport: { t: "end", status: "report", title: "Report this to the ICT unit", text: "Tell them what the ping command showed, and whether other devices were working. That helps them find the fault faster." }
    }
  },
  {
    id: "slow", icon: "gauge",
    title: "Computer is slow",
    blurb: "Programs take long to open, or everything freezes.",
    keywords: "slow lag freeze hang memory disk space storage task manager restart",
    nodes: {
      start: { t: "q", text: "Is it slow only when one program is open, such as a browser with many tabs, or a design or video program?", yes: "oneprog", no: "rebooted" },
      oneprog: { t: "step", text: "Save your work, close the program and open it again. Close extra tabs and programs. Design and video programs need a lot of memory, so open only what you need.", ok: "fixed", fail: "rebooted" },
      rebooted: { t: "q", text: "Has the computer been restarted in the last few days?", hint: "Closing the lid or putting it to sleep is not a restart.", yes: "space", no: "restart" },
      restart: { t: "step", text: "Save your work and restart the computer (Start menu, Power, Restart).", ok: "fixed", fail: "space" },
      space: { t: "q", text: "Is the drive almost full? Open File Explorer, then This PC, and check whether the drive bar is red.", yes: "clean", no: "taskman" },
      clean: { t: "step", text: "Delete large files you no longer need, such as old downloads and videos, then empty the Recycle Bin. On a lab computer, ask the staff before deleting anything that is not yours.", ok: "fixed", fail: "ereport" },
      taskman: { t: "step", text: "Press Ctrl + Shift + Esc to open Task Manager. Click Memory, then CPU, to see what uses the most. Close only programs you recognise. If you see a program you do not know that uses a lot, do not ignore it: report it.", ok: "fixed", fail: "ereport" },
      fixed: { t: "end", status: "fixed", title: "Speed is back", text: "Good. A restart every few days and some free disk space prevent most slowness." },
      ereport: { t: "end", status: "report", title: "Report this to the ICT unit", text: "Tell them which program was slow, what you tried and whether the drive was full. The computer may need cleaning, more memory or a check for unwanted programs." }
    }
  },
  {
    id: "display", icon: "monitor",
    title: "Projector or display problem",
    blurb: "No signal, wrong screen, or the picture will not show.",
    keywords: "projector display screen hdmi vga no signal extend duplicate monitor presentation",
    nodes: {
      start: { t: "q", text: "Is the projector or monitor switched on with its light on?", hint: "A projector needs a minute to warm up. Check the lens cap is off.", yes: "cable", no: "poweron" },
      poweron: { t: "step", text: "Plug it in, switch it on at the wall and press its power button (or the remote). Wait one minute.", ok: "fixed", fail: "cable" },
      cable: { t: "q", text: "Is the video cable pushed in fully at both the computer and the projector or monitor?", yes: "source", no: "fixcable" },
      fixcable: { t: "step", text: "Push the cable in firmly at both ends. If you use an adapter, check it too.", ok: "fixed", fail: "source" },
      source: { t: "q", text: "Is the projector or monitor set to the same input as the cable you used (HDMI or VGA)?", yes: "win", no: "input" },
      input: { t: "step", text: "Press the Source or Input button on the projector, monitor or remote and choose the input that matches the cable.", ok: "fixed", fail: "win" },
      win: { t: "step", text: "On the computer press the Windows key + P and choose Duplicate (same picture) or Extend. Then try a different cable if you can.", ok: "fixed", fail: "ereport" },
      fixed: { t: "end", status: "fixed", title: "The picture is showing", text: "Good. For events, test the display before the audience arrives." },
      ereport: { t: "end", status: "report", title: "Report this to the ICT unit", text: "Tell them the projector or monitor, the cable type and what the screen says, for example No Signal." }
    }
  },
  {
    id: "software", icon: "box",
    title: "Program will not install or open",
    blurb: "An installer fails, hangs, or the program closes by itself.",
    keywords: "install software program app photoshop premiere crash open update administrator permission error",
    nodes: {
      start: { t: "q", text: "Does the drive have at least 20 GB free?", hint: "Large programs such as design and video editors need a lot of space.", yes: "admin", no: "space" },
      space: { t: "step", text: "Free some space by deleting files you no longer need, and empty the Recycle Bin. On a lab computer ask the staff before deleting anything that is not yours. Then try again.", ok: "fixed", fail: "admin" },
      admin: { t: "q", text: "Does a message ask for an administrator name or password?", yes: "eadmin", no: "opens" },
      eadmin: { t: "end", status: "report", title: "Ask the ICT unit to install it", text: "Installing programs needs administrator rights. Do not try to get around this. Ask the ICT unit and tell them the name of the program and the computer number." },
      opens: { t: "q", text: "Does the program install without errors but fail to open, or close itself?", yes: "restart", no: "hang" },
      restart: { t: "step", text: "Restart the computer, then open the program again. Check that you have the 64-bit version if the computer is 64-bit (Settings, System, About).", ok: "fixed", fail: "ereport" },
      hang: { t: "step", text: "Close other programs, run the installer again and do not interrupt it. Large installers can take 20 to 30 minutes. If a progress bar has not moved after 30 minutes, stop and report.", ok: "fixed", fail: "ereport" },
      fixed: { t: "end", status: "fixed", title: "Program is working", text: "Good. Open the program once after installing to be sure it starts properly." },
      ereport: { t: "end", status: "report", title: "Report this to the ICT unit", text: "Give the program name, the exact error message if there is one, and the computer number." }
    }
  },
  {
    id: "printer", icon: "printer",
    title: "Printer will not print",
    blurb: "Nothing comes out, paper jams, or the job is stuck.",
    keywords: "print printer paper jam queue toner ink cancel",
    nodes: {
      start: { t: "q", text: "Is the printer switched on, with paper loaded and no warning light?", yes: "chosen", no: "prep" },
      prep: { t: "step", text: "Switch it on, load paper and close all covers. If a light shows a paper jam, gently pull out the jammed paper in the direction of travel.", ok: "fixed", fail: "chosen" },
      chosen: { t: "q", text: "Is the correct printer selected when you click Print?", yes: "queue", no: "pick" },
      pick: { t: "step", text: "In the Print window, open the printer list and choose the right one, then print again.", ok: "fixed", fail: "queue" },
      queue: { t: "q", text: "Is there an old job stuck in the print queue?", hint: "Settings, Printers and scanners, choose the printer, Open print queue.", yes: "cancel", no: "ereport" },
      cancel: { t: "step", text: "In the print queue, choose Printer, then Cancel All Documents. Switch the printer off and on, then print once.", ok: "fixed", fail: "ereport" },
      fixed: { t: "end", status: "fixed", title: "Printing works", text: "Good. Print only once. Printing again and again fills the queue." },
      ereport: { t: "end", status: "report", title: "Report this to the ICT unit", text: "Tell them which printer it is, what the light or screen shows, and what you tried." }
    }
  },
  {
    id: "account", icon: "key",
    title: "Forgot or locked password",
    blurb: "You cannot sign in to a portal, email or lab computer.",
    keywords: "password login sign in locked account forgot reset portal email username",
    nodes: {
      start: { t: "q", text: "Is it your college portal or email password?", yes: "portal", no: "lab" },
      portal: { t: "step", text: "Use the Forgot password link on the official portal page. Type the portal address yourself and do not use a link from an email. Check Caps Lock and try once more before you reset.", ok: "fixed", fail: "eportal" },
      eportal: { t: "end", status: "report", title: "Ask the ICT unit in person", text: "Go to the ICT unit office with your ID. Never send your password to anyone, even a person who says they are from ICT. Real ICT staff do not need it." },
      lab: { t: "q", text: "Is it the sign-in for a lab computer?", yes: "elab", no: "other" },
      elab: { t: "end", status: "report", title: "Ask the staff in charge of the lab", text: "Lab accounts are managed by the ICT unit. Ask the staff in charge, and do not use another person's account." },
      other: { t: "step", text: "Use that service's own Forgot password page, typed in by you, and choose a new password you have not used before. Use a long password and turn on two-step verification if it is offered.", ok: "fixed", fail: "eportal" },
      fixed: { t: "end", status: "fixed", title: "You are back in", text: "Good. Do not share the new password and do not reuse it on other sites." }
    }
  },
  {
    id: "share", icon: "share",
    title: "Cannot open a shared folder",
    blurb: "A shared folder on another lab computer will not open.",
    keywords: "share shared folder network lab file sharing ping access denied permission unc",
    nodes: {
      start: { t: "q", text: "Can you ping the computer that holds the shared folder?", hint: "In Command Prompt type: ping COMPUTER-NAME (or its IP address).", yes: "ask", no: "samenet" },
      samenet: { t: "step", text: "Check that your network cable or Wi-Fi is connected, that both computers are on the same network, and that the other computer is switched on and not asleep.", ok: "fixed", fail: "ereport" },
      ask: { t: "q", text: "Does it ask for a username and password?", yes: "creds", no: "path" },
      creds: { t: "step", text: "Use the account details the ICT staff gave you for the shared folder. Do not guess or try other people's details. Participants usually have read-only access, so you can open and copy files but not change them.", ok: "fixed", fail: "ereport" },
      path: { t: "step", text: "Open File Explorer and type two backslashes followed by the computer name in the address bar, for example \\\\COMPUTER-NAME. If the name does not work, try the IP address, for example \\\\192.168.1.10.", ok: "fixed", fail: "ereport" },
      fixed: { t: "end", status: "fixed", title: "You can reach the folder", text: "Good. Copy the files you need to your own computer before you open them." },
      ereport: { t: "end", status: "report", title: "Report this to the ICT unit", text: "Tell them the computer name, what the ping command showed and any message you saw. Sharing settings or the firewall on the host computer may need checking." }
    }
  }
];
