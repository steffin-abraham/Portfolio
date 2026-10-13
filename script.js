/**
 * Steffin Abraham - Entry-Level DevOps Engineer Portfolio
 * Vanilla JavaScript Implementation
 * 
 * Features:
 * 1. Hero Dynamic Typing Effect
 * 2. CI/CD Pipeline Simulator (Code -> Build -> Test -> Deploy)
 * 3. Interactive Shell Terminal with command history & auto-complete chips
 * 4. Project Lab Architecture Modal Dialogs
 * 5. Contact Form Client-Side Validation & Toast Notifications
 * 6. Sticky Navbar Blur & Active ScrollSpy Navigation
 * 7. One-Click Clipboard Copying
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Typing Effect in Hero Section
     ========================================================================== */
  const typedTextEl = document.getElementById('typed-text');
  if (typedTextEl) {
    const textPhrases = [
      'Steffin Abraham',
      'Cloud & DevOps Enthusiast',
      'AWS Infrastructure Builder',
      'Linux & Bash Specialist',
      'Git Workflow Architect'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeLoop() {
      const currentPhrase = textPhrases[phraseIndex];

      if (isDeleting) {
        typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 95;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at full word
        isDeleting = true;
        typingSpeed = 1900;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % textPhrases.length;
        typingSpeed = 450;
      }

      setTimeout(typeLoop, typingSpeed);
    }

    typeLoop();
  }

  /* ==========================================================================
     2. Sticky Header Blur & Active Nav Highlight
     ========================================================================== */
  const mainHeader = document.getElementById('main-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Handle header scroll style
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    // ScrollSpy for active nav items
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Mobile drawer toggle
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
      mobileNav.setAttribute('aria-hidden', isExpanded);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ==========================================================================
     3. CI/CD Dynamic Pipeline Visualizer
     ========================================================================== */
  const triggerPipelineBtn = document.getElementById('trigger-pipeline-btn');
  const resetPipelineBtn = document.getElementById('reset-pipeline-btn');
  const pipelineLogContent = document.getElementById('pipeline-log-content');
  const pipelineStatusText = document.getElementById('pipeline-status-text');

  const stageNodes = [
    document.getElementById('stage-code'),
    document.getElementById('stage-build'),
    document.getElementById('stage-test'),
    document.getElementById('stage-deploy')
  ];

  const connectors = document.querySelectorAll('.pipeline-connector');
  let isPipelineRunning = false;
  let pipelineTimeouts = [];

  const stageLogs = [
    {
      time: '[00:00:01]',
      tag: 'tag-run',
      tagText: 'STAGE 1',
      msg: 'CODE: Triggered via GitHub webhook (push to branch: main by Steffin Abraham).'
    },
    {
      time: '[00:00:02]',
      tag: 'tag-pass',
      tagText: 'SUCCESS',
      msg: 'CODE: Branch protection rules verified. All required reviewers approved.'
    },
    {
      time: '[00:00:03]',
      tag: 'tag-run',
      tagText: 'STAGE 2',
      msg: 'BUILD: Assembling deployment package. Preparing AWS User Data init script...'
    },
    {
      time: '[00:00:04]',
      tag: 'tag-pass',
      tagText: 'SUCCESS',
      msg: 'BUILD: Artifact bundled. Amazon Linux 2023 environment dependencies resolved.'
    },
    {
      time: '[00:00:05]',
      tag: 'tag-run',
      tagText: 'STAGE 3',
      msg: 'TEST: Executing ShellCheck linter on bootstrap scripts & verifying SSH key perms...'
    },
    {
      time: '[00:00:06]',
      tag: 'tag-pass',
      tagText: 'SUCCESS',
      msg: 'TEST: Security Group audit passed (Port 22 restricted, zero exposed secrets).'
    },
    {
      time: '[00:00:07]',
      tag: 'tag-run',
      tagText: 'STAGE 4',
      msg: 'DEPLOY: Connecting to AWS EC2 instance (t3.micro). Initiating rolling service update...'
    },
    {
      time: '[00:00:08]',
      tag: 'tag-deploy',
      tagText: 'LIVE',
      msg: 'DEPLOY: Nginx service restarted (PID: 1420). HTTP 200 OK health check verified!'
    }
  ];

  function appendLog(log) {
    if (!pipelineLogContent) return;
    const row = document.createElement('div');
    row.className = 'log-row';
    row.innerHTML = `<span class="log-time">${log.time}</span> <span class="log-tag ${log.tag}">${log.tagText}</span> ${escapeHTML(log.msg)}`;
    pipelineLogContent.appendChild(row);
    pipelineLogContent.scrollTop = pipelineLogContent.scrollHeight;
  }

  function setStageState(stageIndex, state) {
    const node = stageNodes[stageIndex];
    if (!node) return;

    const badge = node.querySelector('.node-state-badge');
    node.classList.remove('active', 'completed');

    if (state === 'running') {
      node.classList.add('active');
      if (badge) {
        badge.className = 'node-state-badge badge-running font-mono';
        badge.textContent = 'RUNNING';
      }
    } else if (state === 'completed') {
      node.classList.add('completed');
      if (badge) {
        const isDeploy = stageIndex === 3;
        badge.className = `node-state-badge ${isDeploy ? 'badge-live' : 'badge-success'} font-mono`;
        badge.textContent = isDeploy ? 'DEPLOYED' : 'PASSED';
      }
      if (connectors[stageIndex]) {
        connectors[stageIndex].classList.add('completed');
      }
    } else {
      // Pending
      if (badge) {
        badge.className = 'node-state-badge badge-pending font-mono';
        badge.textContent = 'PENDING';
      }
    }
  }

  function runPipelineSimulation() {
    if (isPipelineRunning) return;
    isPipelineRunning = true;
    triggerPipelineBtn.disabled = true;

    // Clear logs and reset UI
    clearPipelineTimeouts();
    if (pipelineLogContent) pipelineLogContent.innerHTML = '';
    if (pipelineStatusText) {
      pipelineStatusText.className = 'font-mono text-xs text-amber';
      pipelineStatusText.textContent = '● STATUS: EXECUTION IN PROGRESS...';
    }

    // Reset stages
    stageNodes.forEach((_, idx) => setStageState(idx, 'pending'));
    connectors.forEach(c => c.classList.remove('active', 'completed'));

    // Timeline execution schedule
    // Stage 0: Code
    pipelineTimeouts.push(setTimeout(() => {
      setStageState(0, 'running');
      appendLog(stageLogs[0]);
    }, 200));

    pipelineTimeouts.push(setTimeout(() => {
      setStageState(0, 'completed');
      appendLog(stageLogs[1]);
      if (connectors[0]) connectors[0].classList.add('active');
      playCyberTone(600, 0.04, 'triangle');
    }, 1200));

    // Stage 1: Build
    pipelineTimeouts.push(setTimeout(() => {
      setStageState(1, 'running');
      appendLog(stageLogs[2]);
    }, 1800));

    pipelineTimeouts.push(setTimeout(() => {
      setStageState(1, 'completed');
      appendLog(stageLogs[3]);
      if (connectors[1]) connectors[1].classList.add('active');
      playCyberTone(750, 0.04, 'triangle');
    }, 2800));

    // Stage 2: Test
    pipelineTimeouts.push(setTimeout(() => {
      setStageState(2, 'running');
      appendLog(stageLogs[4]);
    }, 3400));

    pipelineTimeouts.push(setTimeout(() => {
      setStageState(2, 'completed');
      appendLog(stageLogs[5]);
      if (connectors[2]) connectors[2].classList.add('active');
      playCyberTone(900, 0.04, 'triangle');
    }, 4500));

    // Stage 3: Deploy
    pipelineTimeouts.push(setTimeout(() => {
      setStageState(3, 'running');
      appendLog(stageLogs[6]);
    }, 5100));

    pipelineTimeouts.push(setTimeout(() => {
      setStageState(3, 'completed');
      appendLog(stageLogs[7]);
      if (pipelineStatusText) {
        pipelineStatusText.className = 'font-mono text-xs text-teal';
        pipelineStatusText.textContent = '● STATUS: ALL STAGES PASSED (INFRASTRUCTURE HEALTHY)';
      }
      isPipelineRunning = false;
      triggerPipelineBtn.disabled = false;
      playCyberChirp();
      showToast('CI/CD Pipeline Run Completed: Deployment Live!', 'success');
    }, 6400));
  }

  function resetPipeline() {
    clearPipelineTimeouts();
    isPipelineRunning = false;
    triggerPipelineBtn.disabled = false;

    stageNodes.forEach((_, idx) => setStageState(idx, 'completed'));
    connectors.forEach(c => c.classList.remove('active', 'completed'));

    if (pipelineStatusText) {
      pipelineStatusText.className = 'font-mono text-xs text-teal';
      pipelineStatusText.textContent = '● STATUS: IDLE (READY TO RUN)';
    }

    if (pipelineLogContent) {
      pipelineLogContent.innerHTML = `
        <div class="log-row"><span class="log-time">[00:00:01]</span> <span class="log-tag tag-info">INFO</span> Pipeline initialized for commit <span class="text-teal">a7f14b2</span> by Steffin Abraham.</div>
        <div class="log-row"><span class="log-time">[00:00:02]</span> <span class="log-tag tag-pass">SUCCESS</span> Stage: CODE - Git branch verified, pull request checks completed.</div>
        <div class="log-row"><span class="log-time">[00:00:04]</span> <span class="log-tag tag-pass">SUCCESS</span> Stage: BUILD - Web assets bundled, configuration verified.</div>
        <div class="log-row"><span class="log-time">[00:00:06]</span> <span class="log-tag tag-pass">SUCCESS</span> Stage: TEST - Shell scripts syntax valid, no exposed secrets.</div>
        <div class="log-row"><span class="log-time">[00:00:08]</span> <span class="log-tag tag-deploy">LIVE</span> Stage: DEPLOY - AWS EC2 instance responding HTTP 200 OK on port 80.</div>
      `;
    }
  }

  function clearPipelineTimeouts() {
    pipelineTimeouts.forEach(t => clearTimeout(t));
    pipelineTimeouts = [];
  }

  if (triggerPipelineBtn) {
    triggerPipelineBtn.addEventListener('click', runPipelineSimulation);
  }

  if (resetPipelineBtn) {
    resetPipelineBtn.addEventListener('click', resetPipeline);
  }

  /* ==========================================================================
     4. Interactive Terminal / Shell Playground
     ========================================================================== */
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const cmdChips = document.querySelectorAll('.cmd-chip');

  const commandHistory = [];
  let historyPointer = -1;

  const terminalCommands = {
    help: () => `
<div class="text-white font-bold">Available DevOps Terminal Commands:</div>
<table>
  <tr><th>Command</th><th>Description</th></tr>
  <tr><td><span class="text-teal">whoami</span></td><td>Displays Steffin's role, background & mission statement</td></tr>
  <tr><td><span class="text-teal">skills</span></td><td>Lists core technical skills across AWS, Git & Linux</td></tr>
  <tr><td><span class="text-teal">aws</span></td><td>Inspect simulated AWS EC2 instances & security group rules</td></tr>
  <tr><td><span class="text-teal">git</span></td><td>Shows current git tree status and branch topology</td></tr>
  <tr><td><span class="text-teal">projects</span></td><td>Lists hands-on engineering lab projects</td></tr>
  <tr><td><span class="text-teal">pipeline</span></td><td>Executes and reports on the CI/CD deployment pipeline</td></tr>
  <tr><td><span class="text-teal">education</span></td><td>Details of BCA degree and academic coursework</td></tr>
  <tr><td><span class="text-teal">github</span></td><td>Direct link to Steffin's GitHub profile and repositories</td></tr>
  <tr><td><span class="text-teal">contact</span></td><td>Displays direct contact email and communications link</td></tr>
  <tr><td><span class="text-teal">uptime</span></td><td>Displays server uptime and node resource allocation</td></tr>
  <tr><td><span class="text-teal">clear</span></td><td>Clears the terminal output screen</td></tr>
  <tr><td><span class="text-amber">sudo</span></td><td>Attempts root privilege escalation (try it!)</td></tr>
</table>
<div class="text-muted text-xs" style="margin-top: 6px;">Tip: You can click the quick-command pills above or use Up/Down arrow keys for history.</div>
    `,

    whoami: () => `
<span class="text-teal font-bold">Steffin Abraham</span> &mdash; Entry-Level DevOps Engineer & BCA Graduate.<br>
Passionate about automating cloud infrastructure on AWS, streamlining Git collaboration, and administering robust Linux systems.
Focused on reliability, zero-downtime deployments, and defensive security configurations.
    `,

    skills: () => `
<span class="text-amber font-bold">[1. AWS CLOUD INFRASTRUCTURE]</span><br>
&bull; EC2 Instance Provisioning (t2/t3 series, Amazon Linux 2023, Ubuntu Server)<br>
&bull; Security Groups (Strict Inbound SSH Port 22 IP Whitelisting, Public HTTP 80)<br>
&bull; User Data Scripts (Automated bootstrapping of Apache & Nginx)<br>
&bull; Basic IAM (User policies, least privilege access, EC2 instance roles)<br>
&bull; SSH RSA Key Pairs (Enforcing chmod 400 private key security)<br><br>

<span class="text-teal font-bold">[2. VERSION CONTROL (GIT & GITHUB)]</span><br>
&bull; Branching Models: Feature branching (feature/*, hotfix/*), Trunk-based workflows<br>
&bull; Merge Conflict Resolution: 3-way manual conflict fixing, interactive rebasing<br>
&bull; GitHub Governance: Branch protection rulesets, required PR approvals<br>
&bull; Conventional Commits & Clean History auditing via git log graph<br><br>

<span class="text-amber font-bold">[3. SCRIPTING & LINUX SYSTEMS]</span><br>
&bull; Shell Navigation: POSIX utilities (grep, awk, sed, find, curl, tar, journalctl)<br>
&bull; Bash Automation: Scripts with error traps (set -euo pipefail), functions, logs<br>
&bull; Administration: Permissions (chmod/chown), systemd services, cron timers
    `,

    aws: () => `
<span class="text-teal font-bold">$ aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType,PublicIpAddress]" --output table</span><br>
----------------------------------------------------------------------------------<br>
|                              DescribeInstances                                  |<br>
+-----------------------+------------+-------------+-----------------------------+<br>
|  i-0a8bf29c1932ed0    |  running   |  t3.micro   |  54.210.88.19 (HTTP:80)     |<br>
|  i-0e12ca871904a11    |  running   |  t2.micro   |  34.201.12.94 (Bastion)     |<br>
+-----------------------+------------+-------------+-----------------------------+<br>
<span class="text-muted">Security Group: sg-webserver-strict (Ingress: 22 [Authorized-IP], 80 [0.0.0.0/0])</span>
    `,

    git: () => `
<span class="text-teal font-bold">$ git log --graph --oneline --decorate -n 5</span><br>
* <span class="text-teal">a7f14b2</span> (HEAD -> <span class="text-amber">main</span>, <span class="text-teal">origin/main</span>) feat(deploy): auto-bootstrap nginx via ec2 user-data<br>
*   <span class="text-teal">f89021b</span> Merge pull request #4 from steffin/feature/security-group-hardening<br>
|\\ <br>
| * <span class="text-teal">b2149e8</span> fix(sec): restrict SSH inbound rule to single management CIDR<br>
| * <span class="text-teal">190da23</span> chore(docs): document RSA key pair permissions in README<br>
|/  <br>
* <span class="text-teal">e0018fa</span> init(repo): scaffold repository structure and gitignore
    `,

    projects: () => `
<div class="text-white font-bold">Featured Engineering Labs:</div>
1. <span class="text-teal">Automated EC2 Web Server Deployment</span><br>
   &rarr; Provisioned secure EC2 instances, restrictive Security Groups, and automated bootstrap user-data scripts.<br>
2. <span class="text-amber">Multi-Branch Git Collaboration Workflow</span><br>
   &rarr; Built enterprise branch protection rules, practiced rebase conflict resolution, and enforced PR hygiene.<br>
3. <span class="text-teal">Linux System Daemon & Uptime Watchdog</span><br>
   &rarr; Automated Bash script monitoring server health and self-healing crashed services.<br>
<div class="text-muted text-xs">Click "View Projects & Labs" in the navigation bar to read full architecture breakdowns.</div>
    `,

    pipeline: () => {
      // Trigger visualizer and return message
      runPipelineSimulation();
      return `<span class="text-teal font-bold">[ACTION TRIGGERED]</span> CI/CD workflow <span class="text-amber">deploy-webserver-ec2.yml</span> execution scheduled! Observe the timeline in Section 03.`;
    },

    education: () => `
<span class="text-teal font-bold">Bachelor of Computer Applications (BCA)</span><br>
&bull; Core Focus: Operating Systems, Computer Networking (TCP/IP, OSI, Routing), Software Engineering.<br>
&bull; Practical Foundation: Linux operating environments, database management, and object-oriented architectures.<br>
&bull; Specialization: Shifted academic core into hands-on DevOps, cloud computing, and infrastructure reliability.
    `,

    github: () => `
<span class="text-teal font-bold">Steffin Abraham GitHub Profile:</span><br>
Link: <a href="https://github.com/steffin-abraham" target="_blank" rel="noopener noreferrer" class="text-amber" style="text-decoration: underline;">https://github.com/steffin-abraham</a><br>
Repositories: AWS EC2 automation, Git branch workflows, Linux sysadmin daemons.
    `,

    email: () => `
<span class="text-teal font-bold">Steffin Abraham Direct Email:</span><br>
Open in Gmail: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=steffin2000@gmail.com" target="_blank" rel="noopener noreferrer" class="text-amber" style="text-decoration: underline;">steffin2000@gmail.com (Compose in Gmail)</a>
    `,

    contact: () => `
<span class="text-teal font-bold">Steffin Abraham Contact Information:</span><br>
Email (Gmail): <a href="https://mail.google.com/mail/?view=cm&fs=1&to=steffin2000@gmail.com" target="_blank" rel="noopener noreferrer" class="text-amber" style="text-decoration: underline;">steffin2000@gmail.com</a><br>
GitHub: <a href="https://github.com/steffin-abraham" target="_blank" rel="noopener noreferrer" class="text-amber" style="text-decoration: underline;">github.com/steffin-abraham</a><br>
Status: Available for full-time junior DevOps / Cloud infrastructure positions.<br>
Location: India (Open to Remote / Hybrid / On-site roles).
    `,

    uptime: () => `
<span class="text-teal font-bold">07:14:00 up 42 days, 18:22, 1 user, load average: 0.08, 0.04, 0.01</span><br>
Memory: 412MB / 1024MB used (60% free)<br>
Disk: /dev/xvda1 4.2G / 20G used (18% used)<br>
Status: All system services operational.
    `,

    sudo: () => `
<span class="text-amber font-bold">nice try! :)</span><br>
[SECURITY ALERT] User 'guest' is not in the sudoers file. This incident has been logged and reported to <span class="text-teal">/var/log/auth.log</span>.
    `,

    matrix: () => {
      setTimeout(() => startMatrixStream(), 100);
      return `<span class="text-teal font-bold">[STREAMING MATRIX TELEMETRY]</span> Initializing secure quantum datastream...`;
    },

    clear: () => null
  };

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    playCyberTone(720, 0.035, 'sine');
    commandHistory.push(trimmed);
    historyPointer = commandHistory.length;

    // Create entry in terminal history
    const commandLine = document.createElement('div');
    commandLine.className = 'term-line';
    commandLine.innerHTML = `
      <span class="term-prompt"><span class="text-teal">steffin@devops-node</span>:<span class="text-amber">~</span>$</span>
      <span class="term-command">${escapeHTML(trimmed)}</span>
    `;
    terminalHistory.appendChild(commandLine);

    const cmdLower = trimmed.toLowerCase();

    if (cmdLower === 'clear') {
      terminalHistory.innerHTML = '';
      return;
    }

    const outputLine = document.createElement('div');
    outputLine.className = 'term-output';

    if (terminalCommands[cmdLower]) {
      const result = terminalCommands[cmdLower]();
      if (result) outputLine.innerHTML = result;
    } else {
      outputLine.innerHTML = `
        <span class="text-amber">bash: command not found: ${escapeHTML(trimmed)}</span><br>
        Type <span class="text-teal font-bold">'help'</span> to see a list of available DevOps commands.
      `;
    }

    terminalHistory.appendChild(outputLine);
    terminalHistory.scrollTop = terminalHistory.scrollHeight;
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      executeCommand(terminalInput.value);
      terminalInput.value = '';
    });

    // Arrow up / down for command history
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        if (historyPointer > 0) {
          historyPointer--;
          terminalInput.value = commandHistory[historyPointer] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (historyPointer < commandHistory.length - 1) {
          historyPointer++;
          terminalInput.value = commandHistory[historyPointer] || '';
        } else {
          historyPointer = commandHistory.length;
          terminalInput.value = '';
        }
      }
    });
  }

  // Quick command chips click
  cmdChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        playCyberTone(850, 0.03, 'triangle');
        if (terminalInput) terminalInput.value = cmd;
        executeCommand(cmd);
      }
    });
  });

  /* ==========================================================================
     5. Project Lab Detail Modal Dialog
     ========================================================================== */
  const labModal = document.getElementById('lab-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalTag = document.getElementById('modal-tag');
  const modalBody = document.getElementById('modal-body');
  const labTriggers = document.querySelectorAll('.lab-detail-trigger');

  const labDetailsData = {
    ec2: {
      tag: 'AWS INFRASTRUCTURE LAB // 01',
      title: 'Automated EC2 Web Server Deployment Breakdown',
      content: `
        <p class="text-muted">
          This hands-on lab focused on creating a resilient, automated web hosting environment on Amazon Web Services using native compute and networking primitives.
        </p>

        <h4 class="modal-section-title">1. Security Architecture & Scoped Access</h4>
        <p class="text-muted text-sm">
          Instead of leaving default open rules (<span class="font-mono text-amber">0.0.0.0/0</span> on port 22), we engineered a defensive Security Group (<span class="font-mono text-teal">sg-webserver-strict</span>):
        </p>
        <ul class="text-sm text-muted" style="margin-left: 1.25rem; margin-top: 0.5rem;">
          <li><strong>SSH (Port 22):</strong> Whitelisted strictly to the administrator's specific static IP address.</li>
          <li><strong>HTTP (Port 80):</strong> Publicly accessible to handle inbound web traffic.</li>
          <li><strong>Outbound Traffic:</strong> Permitted for package repositories (<span class="font-mono">yum/dnf</span>) over port 443.</li>
        </ul>

        <h4 class="modal-section-title">2. Automated Bootstrap via EC2 User Data</h4>
        <p class="text-muted text-sm">
          To ensure repeatability and zero-touch configuration, the following script was passed into instance launch metadata:
        </p>
        <pre class="modal-code-snippet"><code>#!/bin/bash
# EC2 User Data Bootstrap Script - Amazon Linux 2023
set -euo pipefail

# 1. Update OS package repositories
dnf update -y

# 2. Install web server and diagnostics tools
dnf install -y nginx curl

# 3. Enable and start Nginx system service
systemctl enable nginx
systemctl start nginx

# 4. Generate custom diagnostic landing page
cat &lt;&lt; 'EOF' &gt; /usr/share/nginx/html/index.html
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;title&gt;DevOps Node Active&lt;/title&gt;&lt;/head&gt;
&lt;body style="background:#0b0f19;color:#00f5d4;font-family:monospace;padding:2rem;"&gt;
  &lt;h1&gt;Steffin Abraham // EC2 Production Host&lt;/h1&gt;
  &lt;p&gt;Status: Healthy &bull; Host: $(hostname -f) &bull; Provisioned via User Data&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;
EOF

# 5. Verify local HTTP response
curl -I http://localhost:80</code></pre>

        <h4 class="modal-section-title">3. Key Engineering Takeaways</h4>
        <p class="text-muted text-sm">
          Learned the importance of stateless cloud servers, the mechanics of cloud-init logs (<span class="font-mono text-teal">/var/log/cloud-init-output.log</span>), and securing RSA keys with <span class="font-mono text-teal">chmod 400</span>.
        </p>
      `
    },

    git: {
      tag: 'VERSION CONTROL LAB // 02',
      title: 'Multi-Branch Git Collaboration & Governance Drill',
      content: `
        <p class="text-muted">
          A deep dive into industry-standard Git branch topologies, simulating multi-contributor conflicts, and implementing automated branch protection policies.
        </p>

        <h4 class="modal-section-title">1. Branch Lifecycle & Topology</h4>
        <p class="text-muted text-sm">
          Implemented a structured trunk/feature model:
        </p>
        <ul class="text-sm text-muted" style="margin-left: 1.25rem; margin-top: 0.5rem;">
          <li><span class="font-mono text-teal">main:</span> Production-ready, locked from direct commits.</li>
          <li><span class="font-mono text-amber">develop:</span> Integration baseline for pending releases.</li>
          <li><span class="font-mono">feature/*:</span> Isolated contributor branches branched from develop.</li>
        </ul>

        <h4 class="modal-section-title">2. Conflict Simulation & Rebase Resolution</h4>
        <p class="text-muted text-sm">
          Simulated parallel development where two branches altered the same infrastructure configuration file. Executed step-by-step resolution:
        </p>
        <pre class="modal-code-snippet"><code># 1. Update local develop branch
git checkout develop
git pull origin develop

# 2. Switch to feature branch and rebase onto develop
git checkout feature/security-group-hardening
git rebase develop

# 3. Encounter conflict in infra-spec.json -> Inspect differences
git status
# Auto-merging infra-spec.json
# CONFLICT (content): Merge conflict in infra-spec.json

# 4. Resolve conflict markers manually (preserving required CIDR rules)
# 5. Stage resolved file and continue rebase
git add infra-spec.json
git rebase --continue

# 6. Push cleanly to remote feature branch
git push origin feature/security-group-hardening --force-with-lease</code></pre>

        <h4 class="modal-section-title">3. GitHub Branch Rulesets</h4>
        <p class="text-muted text-sm">
          Enforced mandatory pull request reviews, required conversation resolutions before merging, and disabled unverified force-pushes on production branches.
        </p>
      `
    },

    linux: {
      tag: 'SYSTEM ADMINISTRATION LAB // 03',
      title: 'Linux Watchdog & Self-Healing Service Daemon',
      content: `
        <p class="text-muted">
          Created a lightweight systems watchdog script in Bash to monitor critical server processes (Nginx/Apache), log resource spikes, and automatically self-heal crashed services.
        </p>

        <h4 class="modal-section-title">1. Watchdog Script Implementation</h4>
        <pre class="modal-code-snippet"><code>#!/usr/bin/env bash
# watchdog.sh - Service Health Check & Auto-Restart
set -euo pipefail

SERVICE="nginx"
LOG_FILE="/var/log/watchdog.log"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

log_message() {
  echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

# Check if service is active via systemctl
if systemctl is-active --quiet "$SERVICE"; then
  log_message "HEALTHY: $SERVICE service is running normally."
else
  log_message "ALERT: $SERVICE is DOWN! Attempting automatic recovery..."
  systemctl restart "$SERVICE"
  
  if systemctl is-active --quiet "$SERVICE"; then
    log_message "RECOVERED: $SERVICE successfully restarted."
  else
    log_message "CRITICAL: $SERVICE failed to restart. Alerting on-call engineer!"
    exit 1
  fi
fi

# Disk space check
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
if [ "$DISK_USAGE" -gt 85 ]; then
  log_message "WARNING: Root filesystem disk usage exceeds 85% (Current: \${DISK_USAGE}%)."
fi</code></pre>

        <h4 class="modal-section-title">2. Scheduling via Cron</h4>
        <p class="text-muted text-sm">
          Automated the check to execute every 5 minutes by registering a root crontab entry:
          <span class="font-mono text-teal">*/5 * * * * /usr/local/bin/watchdog.sh &gt;/dev/null 2&gt;&amp;1</span>.
        </p>
      `
    }
  };

  labTriggers.forEach(button => {
    button.addEventListener('click', () => {
      const projectKey = button.getAttribute('data-project');
      const data = labDetailsData[projectKey];
      if (data && labModal) {
        modalTag.textContent = data.tag;
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        labModal.showModal();
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (labModal && labModal.open) {
      labModal.close();
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (labModal) {
    labModal.addEventListener('click', (e) => {
      if (e.target === labModal || e.target.classList.contains('modal-backdrop-layer')) {
        closeModal();
      }
    });

    labModal.addEventListener('cancel', () => {
      document.body.style.overflow = '';
    });
  }

  /* ==========================================================================
     6. Contact Form Validation & Toast Notification
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const submitBtnText = document.getElementById('submit-btn-text');

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validateField(input, errorEl, condition, errorMessage) {
    if (!condition) {
      input.classList.add('is-invalid');
      errorEl.textContent = errorMessage;
      return false;
    } else {
      input.classList.remove('is-invalid');
      errorEl.textContent = '';
      return true;
    }
  }

  if (contactForm) {
    // Real-time input clear
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('is-invalid');
          const errorSpan = input.nextElementSibling;
          if (errorSpan && errorSpan.classList.contains('error-feedback')) {
            errorSpan.textContent = '';
          }
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(
        nameInput,
        nameError,
        nameInput.value.trim().length >= 2,
        'Please enter your name (at least 2 characters).'
      );

      const isEmailValid = validateField(
        emailInput,
        emailError,
        validateEmail(emailInput.value.trim()),
        'Please provide a valid email address (e.g. name@domain.com).'
      );

      const isSubjectValid = validateField(
        subjectInput,
        subjectError,
        subjectInput.value.trim().length >= 3,
        'Please enter a subject topic.'
      );

      const isMessageValid = validateField(
        messageInput,
        messageError,
        messageInput.value.trim().length >= 10,
        'Message must be at least 10 characters.'
      );

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        showToast('Please correct the highlighted fields before submitting.', 'warning');
        return;
      }

      // Prepare direct Gmail compose URL with recipient, subject, and message pre-populated
      const subject = encodeURIComponent(subjectInput.value.trim());
      const body = encodeURIComponent(
        `Hi Steffin,\n\n${messageInput.value.trim()}\n\n---\nSender: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}`
      );
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=steffin2000@gmail.com&su=${subject}&body=${body}`;

      submitBtn.disabled = true;
      const originalText = submitBtnText.textContent;
      submitBtnText.textContent = 'Launching Gmail...';

      setTimeout(() => {
        window.open(gmailUrl, '_blank');
        submitBtn.disabled = false;
        submitBtnText.textContent = originalText;
        contactForm.reset();

        showToast('Opening Gmail directly addressed to steffin2000@gmail.com', 'success');
      }, 450);
    });
  }

  /* ==========================================================================
     7. Toast Notification Utility
     ========================================================================== */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="icon text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg class="icon text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    } else {
      iconSvg = '<svg class="icon text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
      ${iconSvg}
      <span>${escapeHTML(message)}</span>
    `;

    toastContainer.appendChild(toast);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.add('toast-dismiss');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, 4000);
  }

  /* ==========================================================================
     8. Copy Email to Clipboard
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'steffin2000@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        showToast('Email address copied to clipboard: steffin2000@gmail.com', 'success');
      } catch (err) {
        showToast('Could not copy to clipboard. Email: steffin2000@gmail.com', 'info');
      }
    });
  }

  /* ==========================================================================
     9. Dynamic Footer Year & Helpers
     ========================================================================== */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     2. Lightweight Canvas Particle Network (Vanilla JS + HTML5 Canvas)
     ========================================================================== */
  function initCyberCanvas() {
    const canvas = document.getElementById('cyber-canvas');
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    const particleCount = 35; // 30 to 40 slow-moving cloud node particles
    const maxLinkDistance = 100; // 100px connecting line threshold
    let animationFrameId = null;

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    class CloudNodeParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = initial ? Math.random() * width : (Math.random() > 0.5 ? 0 : width);
        this.y = initial ? Math.random() * height : Math.random() * height;
        // Slow-moving drift in random directions
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.5 + 1.2; // Cloud node representation
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce gently off boundaries
        if (this.x < 0) { this.x = 0; this.vx *= -1; }
        if (this.x > width) { this.x = width; this.vx *= -1; }
        if (this.y < 0) { this.y = 0; this.vy *= -1; }
        if (this.y > height) { this.y = height; this.vy *= -1; }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 245, 212, 0.75)';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#00f5d4';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new CloudNodeParticle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles within 100px of each other with low opacity (0.1 to 0.15)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxLinkDistance) {
            // Subtle teal connecting line with low opacity (0.1 to 0.15)
            const opacity = 0.10 + (1 - dist / maxLinkDistance) * 0.05;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 245, 212, ${opacity.toFixed(3)})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    // Start particle network animation
    animationFrameId = requestAnimationFrame(animate);

    // Pause animation when tab is inactive to preserve browser performance
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    });
  }

  /* ==========================================================================
     11. Web Audio API Cyber Synthesizer Engine
     ========================================================================== */
  let audioCtx = null;
  let isSoundEnabled = false;
  const sfxToggleBtn = document.getElementById('sfx-toggle-btn');
  const sfxStatusText = document.getElementById('sfx-status-text');

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playCyberTone(freq = 600, duration = 0.04, type = 'sine', gainLevel = 0.035) {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  function playCyberChirp() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  if (sfxToggleBtn && sfxStatusText) {
    sfxToggleBtn.addEventListener('click', () => {
      initAudioContext();
      isSoundEnabled = !isSoundEnabled;

      if (isSoundEnabled) {
        sfxToggleBtn.classList.add('active');
        sfxStatusText.textContent = 'SFX: ON';
        showToast('Cyber Audio Synthesizer: Enabled', 'info');
        playCyberChirp();
      } else {
        sfxToggleBtn.classList.remove('active');
        sfxStatusText.textContent = 'SFX: OFF';
        showToast('Cyber Audio Synthesizer: Muted', 'info');
      }
    });
  }

  // Hook typing and terminal sounds
  if (terminalInput) {
    terminalInput.addEventListener('keydown', () => {
      if (isSoundEnabled) playCyberTone(800 + Math.random() * 200, 0.025, 'sine', 0.02);
    });
  }

  /* ==========================================================================
     12. Interactive Mouse Follower Spotlight (Idea #3)
     ========================================================================== */
  function initMouseFollowerSpotlight() {
    const cursorSpotlight = document.getElementById('cursor-spotlight');
    const gridSpotlight = document.getElementById('grid-spotlight');
    if (!cursorSpotlight && !gridSpotlight) return;

    // Disable spotlight on mobile devices / touch screens to preserve performance
    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    if (isMobile) return;

    let targetX = -500;
    let targetY = -500;
    let currentX = -500;
    let currentY = -500;
    let isTracking = false;
    let rafId = null;

    function onPointerMove(e) {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isTracking) {
        isTracking = true;
        if (cursorSpotlight) cursorSpotlight.classList.add('active');
        if (gridSpotlight) gridSpotlight.classList.add('active');
        renderSpotlight();
      }
    }

    function renderSpotlight() {
      if (!isTracking) return;

      // Smooth interpolation for fluid follower dynamics
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;

      if (cursorSpotlight) {
        cursorSpotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      // Update CSS variables for radial grid illumination mask (radius ~200px)
      document.documentElement.style.setProperty('--spotlight-x', `${currentX.toFixed(1)}px`);
      document.documentElement.style.setProperty('--spotlight-y', `${currentY.toFixed(1)}px`);

      rafId = requestAnimationFrame(renderSpotlight);
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    document.addEventListener('mouseleave', () => {
      isTracking = false;
      if (cursorSpotlight) cursorSpotlight.classList.remove('active');
      if (gridSpotlight) gridSpotlight.classList.remove('active');
      if (rafId) cancelAnimationFrame(rafId);
    });
  }

  /* ==========================================================================
     13. 3D Card Hover Tilt (Idea #4)
     ========================================================================== */
  function initCard3DTilt() {
    // Disable on touch devices to ensure native vertical scroll feel
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.project-card, .skill-card, .about-main-card, .education-card, .contact-card-direct, .contact-form-card, .pipeline-wrapper-card');
    if (!cards.length) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate cursor coordinates and apply 3D transforms:
        // transform: perspective(1000px) rotateX(...) rotateY(...) scale(1.02)
        const maxTilt = 7;
        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;

        // Pass coordinates to card for localized radial reflection
        card.style.setProperty('--card-mouse-x', `${x.toFixed(1)}px`);
        card.style.setProperty('--card-mouse-y', `${y.toFixed(1)}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     14. Performance-Optimized Reveal-on-Scroll Observer (Intersection Observer API)
     ========================================================================== */
  function initRevealOnScroll() {
    // 1. Gather all reveal elements
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    // 2. Implement staggered entry delays for lists or card grids (e.g. 0.1s, 0.2s, 0.3s)
    const staggerContainers = document.querySelectorAll(
      '.skills-grid, .projects-grid, .about-grid, .contact-grid, .infra-metrics-strip, .principles-grid, .skill-items-list, .pipeline-visual-track'
    );

    staggerContainers.forEach(container => {
      const children = Array.from(container.children).filter(el => el.classList.contains('reveal-on-scroll'));
      children.forEach((item, index) => {
        // Apply cascading delay (card 1 by 0.1s, card 2 by 0.2s, etc.)
        item.style.transitionDelay = `${((index % 8) + 1) * 0.1}s`;
      });
    });

    // Respect reduced motion accessibility
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach(el => el.classList.add('visible'));
      return;
    }

    // 3. IntersectionObserver detecting when 15% visible in viewport
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add active visible state
          entry.target.classList.add('visible');
          // Immediately stop observing to maximize browser performance
          observer.unobserve(entry.target);

          // Once transition completes, clear inline delay so subsequent user hover interactions are instant
          entry.target.addEventListener('transitionend', function onRevealComplete(e) {
            if (e.propertyName === 'opacity' || e.propertyName === 'transform') {
              entry.target.style.transitionDelay = '';
              entry.target.removeEventListener('transitionend', onRevealComplete);
            }
          });
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    // Start observing all designated elements
    revealElements.forEach(el => revealObserver.observe(el));
  }

  function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter-value');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const isDecimal = targetNum % 1 !== 0;

          let start = 0;
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic formula
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = start + (targetNum - start) * easeOut;

            el.textContent = `${prefix}${isDecimal ? currentVal.toFixed(2) : Math.round(currentVal)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${targetNum}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(c => counterObserver.observe(c));
  }

  /* ==========================================================================
     14. Matrix Telemetry Stream in Terminal
     ========================================================================== */
  function startMatrixStream() {
    const matrixLines = [
      '[SEC_POLICY] Verifying AWS IAM policy: LeastPrivilege-ReadOnly-v2... [PASS]',
      '[VPC_ROUTER] Routing internal subnet 10.0.1.0/24 through NAT gateway... [OK]',
      '[HASH_CHECK] Verifying SHA-256 for bootstrap.sh: 8e4b17... [MATCH]',
      '[SYSTEMD] Process monitoring daemon registered with PID: 1984... [ACTIVE]',
      '[NET_INGRESS] Port 22 SSH filter: ALLOWED only from 198.51.100.14/32',
      '[CI_AGENT] Deploying container layer to Amazon Linux 2023 host... [DONE]',
      '[DEV_STATUS] All 4 deployment pipelines healthy. Zero vulnerabilities detected.'
    ];

    let delay = 120;
    matrixLines.forEach((line, index) => {
      setTimeout(() => {
        const row = document.createElement('div');
        row.className = 'term-line';
        row.innerHTML = `<span class="text-teal font-mono text-xs">&gt; ${escapeHTML(line)}</span>`;
        terminalHistory.appendChild(row);
        terminalHistory.scrollTop = terminalHistory.scrollHeight;
        if (isSoundEnabled) playCyberTone(1000 + index * 80, 0.02, 'triangle', 0.015);
      }, delay);
      delay += 180;
    });
  }

  // Initialize visual interactions (prioritize scroll reveal observer)
  try { initRevealOnScroll(); } catch (e) { console.error('Reveal-on-scroll init error:', e); }
  try { initCyberCanvas(); } catch (e) { console.error('Cyber canvas init error:', e); }
  try { initMouseFollowerSpotlight(); } catch (e) { console.error('Mouse follower spotlight init error:', e); }
  try { initCard3DTilt(); } catch (e) { console.error('3D card tilt init error:', e); }
  try { initCounterAnimations(); } catch (e) { console.error('Counter animations init error:', e); }

  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});

