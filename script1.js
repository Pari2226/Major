  // --- LOGIN WALL LOGIC ---
        function showLoginWall() {
            document.body.classList.add('login-wall');
            // Override all nav/action buttons to show login form
            document.querySelectorAll('a,button').forEach(el => {
                if (
                    el.classList.contains('btn-primary') ||
                    el.classList.contains('btn-secondary') ||
                    el.classList.contains('cta-button') ||
                    el.classList.contains('create-event-btn') ||
                    el.classList.contains('dashboard-btn') ||
                    el.classList.contains('find-team-btn') ||
                    el.classList.contains('join-btn') ||
                    el.closest('header') ||
                    el.closest('footer')
                ) {
                    el.addEventListener('click', function(e) {
                        if (!window.isLoggedIn()) {
                            e.preventDefault();
                            showLoginFormInMain();
                        }
                    });
                }
            });
        }
        function removeLoginWall() {
            document.body.classList.remove('login-wall');
        }
        function isLoggedIn() {
            return localStorage.getItem('isLoggedIn') === 'true';
        }
        window.isLoggedIn = isLoggedIn;
        function showLoginFormInMain() {
            var main = document.querySelector('main');
            if (main) main.innerHTML = renderLoginForm();
        }
        // On page load, enforce login wall if not logged in
        document.addEventListener('DOMContentLoaded', function() {
            if (!isLoggedIn()) {
                showLoginWall();
            } else {
                removeLoginWall();
            }
        });
        // After login, remove login wall
        document.body.addEventListener('submit', function(e) {
            if (e.target && e.target.id === 'login-form') {
                setTimeout(() => {
                    removeLoginWall();
                }, 100);
            }
        });
        // If user logs out (future), re-apply login wall
        window.addEventListener('storage', function(e) {
            if (e.key === 'isLoggedIn' && e.newValue !== 'true') {
                showLoginWall();
            }
        });
        // Chatbot logic
        (function() {
            const fab = document.getElementById('chatbot-fab');
            const windowEl = document.getElementById('chatbot-window');
            const closeBtn = document.getElementById('chatbot-close');
            const messagesEl = document.getElementById('chatbot-messages');
            const form = document.getElementById('chatbot-form');
            const input = document.getElementById('chatbot-input');

            function scrollToBottom() {
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }
            function addMessage(text, sender) {
                const msg = document.createElement('div');
                msg.className = 'chatbot-message ' + sender;
                msg.textContent = text;
                messagesEl.appendChild(msg);
                scrollToBottom();
            }
            function botReply(userMsg) {
                const msg = userMsg.toLowerCase();
                if (msg.includes('event')) {
                    return 'You can view all ongoing and upcoming events on the Events dashboard. Need help with a specific event?';
                } else if (msg.includes('create')) {
                    return 'To create a team, go to the Create view and select an event. Fill out the form and submit!';
                } else if (msg.includes('find')) {
                    return 'To find a team, use the Find view or click "Find a Team" on an event card. You can browse and join available teams.';
                } else if (msg.includes('hello') || msg.includes('hi')) {
                    return 'Hello! I am TeamBot. How can I assist you today?';
                } else if (msg.includes('help')) {
                    return 'I can help you with events, creating teams, or finding teams. What would you like to do?';
                } else {
                    return 'Sorry, I can answer questions about events, creating teams, or finding teams. Try asking about those!';
                }
            }
            function showWelcome() {
                messagesEl.innerHTML = '';
                addMessage('👋 Hi! I am TeamBot. Ask me about events, creating a team, or finding a team.', 'bot');
            }
            fab.addEventListener('click', function() {
                windowEl.style.display = 'flex';
                showWelcome();
                setTimeout(scrollToBottom, 100);
            });
            closeBtn.addEventListener('click', function() {
                windowEl.style.display = 'none';
            });
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const val = input.value.trim();
                if (!val) return;
                addMessage(val, 'user');
                setTimeout(() => {
                    addMessage(botReply(val), 'bot');
                }, 400);
                input.value = '';
            });
            // Theme change support: re-show welcome on theme toggle
            document.getElementById('theme-toggle')?.addEventListener('click', function() {
                if (windowEl.style.display !== 'none') showWelcome();
            });
        })();
        // Dashboard: Create, Find, Analyze views
        document.addEventListener('DOMContentLoaded', function() {
            // Demo event data
            const events = [
                { id: 1, title: 'AI Innovation Hackathon', date: '2025-09-10', status: 'ongoing', teams: 12 },
                { id: 2, title: 'Web3 Startup Challenge', date: '2025-09-20', status: 'upcoming', teams: 7 },
                { id: 3, title: 'Cloud Skills Bootcamp', date: '2025-08-15', status: 'expired', teams: 5 },
                { id: 4, title: 'Data Science Sprint', date: '2025-09-25', status: 'upcoming', teams: 4 },
                { id: 5, title: 'Mobile App Jam', date: '2025-09-05', status: 'ongoing', teams: 9 }
            ];
            // Persist myTeams in localStorage for demo
            let myTeams = JSON.parse(localStorage.getItem('myTeams') || 'null');
            if (!myTeams) {
                myTeams = [
                    { eventId: 1, teamName: 'Alpha Coders', leader: 'Alex', members: 4, details: 'AI project', tech: 'Python', status: 'In Progress' },
                    { eventId: 5, teamName: 'Mobile Ninjas', leader: 'Sam', members: 3, details: 'Mobile app', tech: 'Flutter', status: 'Registered' },
                    { eventId: 3, teamName: 'Cloud Masters', leader: 'Priya', members: 5, details: 'Cloud infra', tech: 'Azure', status: 'Completed' }
                ];
                localStorage.setItem('myTeams', JSON.stringify(myTeams));
            }
            function saveMyTeams() {
                localStorage.setItem('myTeams', JSON.stringify(myTeams));
            }
            // Helper: get event by id
            function getEventById(id) {
                return events.find(ev => ev.id === id);
            }
            // Renderers
            function renderCreateView() {
                const filtered = events.filter(ev => ev.status === 'ongoing' || ev.status === 'upcoming');
                let html = `<div class="container" style="padding:3rem 0 2rem;">
                    <h1 style="text-align:center;margin-bottom:2.5rem;">Create a Team for an Event</h1>
                    <div class="dashboard-list">`;
                filtered.forEach(ev => {
                    html += `<div class="dashboard-card" data-event-id="${ev.id}">
                        <div class="event-title">${ev.title}</div>
                        <div class="event-date">${ev.date}</div>
                        <button class="dashboard-btn create-team-btn">Create Team</button>
                    </div>`;
                });
                html += '</div></div>';
                return html;
            }
            function renderFindView() {
                const filtered = events.filter(ev => ev.status === 'ongoing' || ev.status === 'upcoming');
                let html = `<div class="container" style="padding:3rem 0 2rem;">
                    <h1 style="text-align:center;margin-bottom:2.5rem;">Find a Team to Join</h1>
                    <div class="dashboard-list">`;
                filtered.forEach(ev => {
                    html += `<div class="dashboard-card" data-event-id="${ev.id}">
                        <div class="event-title">${ev.title}</div>
                        <div class="event-date">${ev.date}</div>
                        <div class="team-count">${ev.teams} Teams Participating</div>
                        <button class="dashboard-btn find-team-btn">Find a Team</button>
                    </div>`;
                });
                html += '</div></div>';
                return html;
            }
            function renderAnalyzeView() {
                let html = `<div class="container" style="padding:3rem 0 2rem;">
                    <h1 style="text-align:center;margin-bottom:2.5rem;">My Team History</h1>
                    <div class="dashboard-list">`;
                myTeams.forEach(mt => {
                    const ev = getEventById(mt.eventId);
                    if (!ev) return;
                    html += `<div class="dashboard-card">
                        <div class="event-title">${ev.title}</div>
                        <div class="event-date">${ev.date}</div>
                        <div class="team-name">${mt.teamName}</div>
                        <div class="event-status">${mt.status || 'Registered'}</div>
                        <div style="font-size:0.98rem;color:#64748b;margin-bottom:0.5rem;">Leader: ${mt.leader || ''}</div>
                        <div style="font-size:0.98rem;color:#64748b;margin-bottom:0.5rem;">Members: ${mt.members || ''}</div>
                        <div style="font-size:0.98rem;color:#64748b;margin-bottom:0.5rem;">Tech: ${mt.tech || ''}</div>
                        <div style="font-size:0.98rem;color:#64748b;">${mt.details || ''}</div>
                    </div>`;
                });
                html += '</div></div>';
                return html;
            }
            // Main click handler for nav links
            document.body.addEventListener('click', function(e) {
                // Profile icon click: show dashboard if logged in
                if (e.target.classList.contains('profile-icon')) {
                    e.preventDefault();
                    var main = document.querySelector('main');
                    if (main) main.innerHTML = renderDashboardWelcome();
                }
                // Handle Find a Team button (delegated)
                if (e.target.classList.contains('find-team-btn')) {
                    e.preventDefault();
                    const card = e.target.closest('.dashboard-card');
                    if (!card) return;
                    const eventId = parseInt(card.getAttribute('data-event-id'));
                    const event = getEventById(eventId);
                    if (!event) return;
                    const main = document.querySelector('main');
                    if (main) main.innerHTML = renderFindTeamListView(event);
                }

            // Handle Join button (delegated)
            if (e.target.classList.contains('join-btn')) {
                e.preventDefault();
                const btn = e.target;
                btn.textContent = 'Request Sent';
                btn.disabled = true;
                showToast('Your request to join has been sent!');
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = 'Join';
                }, 2000);
            }
            // Render Find Team List View for an event
            function renderFindTeamListView(event) {
                // Only show teams for this event
                const teams = myTeams.filter(t => t.eventId === event.id);
                let html = `<div class="find-team-container">
                    <div class="find-team-title">Teams Registered for ${event.title}</div>
                    <div class="find-team-list">`;
                if (teams.length === 0) {
                    html += `<div style="text-align:center;width:100%;color:#64748b;font-size:1.1rem;">No teams have registered for this event yet.</div>`;
                } else {
                    teams.forEach(team => {
                        html += `<div class="find-team-card">
                            <div class="team-name">${team.teamName}</div>
                            <div class="team-leader">Leader: ${team.leader || ''}</div>
                            <div class="team-members">Members: ${team.members || ''}</div>
                            <div class="team-tech">Tech: ${team.tech || ''}</div>
                            <button class="join-btn">Join</button>
                        </div>`;
                    });
                }
                html += `</div></div><div id="toast" style="position:fixed;top:2rem;left:50%;transform:translateX(-50%);z-index:9999;display:none;min-width:220px;padding:1rem 2rem;background:#22d3ee;color:#fff;border-radius:1.5rem;font-weight:600;box-shadow:0 4px 24px rgba(34,211,238,0.18);text-align:center;"></div>`;
                return html;
            }
                var navLinks = document.querySelector('.nav-links');
                if (!navLinks) return;
                if (e.target.tagName === 'A') {
                    if (e.target.textContent === 'Create') {
                        e.preventDefault();
                        var main = document.querySelector('main');
                        if (main) main.innerHTML = renderCreateView();
                    } else if (e.target.textContent === 'Find') {
                        e.preventDefault();
                        var main = document.querySelector('main');
                        if (main) main.innerHTML = renderFindView();
                    } else if (e.target.textContent === 'Analyze') {
                        e.preventDefault();
                        var main = document.querySelector('main');
                        if (main) main.innerHTML = renderAnalyzeView();
                    } else if (e.target.textContent === 'Login / Sign up') {
                        e.preventDefault();
                        var main = document.querySelector('main');
                        if (main) main.innerHTML = renderLoginForm();
                    }
                }
            // Render Login/Signup Form
            function renderLoginForm() {
                return `
                <div class="login-card">
                    <h2>Login / Sign up</h2>
                    <form id="login-form" autocomplete="off" style="width:100%;display:flex;flex-direction:column;gap:1.2rem;">
                        <label>Email
                            <input type="email" name="email" required placeholder="you@example.com" />
                        </label>
                        <label>Password
                            <input type="password" name="password" required placeholder="Password" />
                        </label>
                        <button type="submit" class="login-btn">Enter</button>
                    </form>
                </div>
                `;
            }

            // Handle Login Form Submission
            document.body.addEventListener('submit', function(e) {
                if (e.target && e.target.id === 'login-form') {
                    e.preventDefault();
                    // Simulate login (no real auth)
                    var email = e.target.elements.email.value;
                    var username = email && email.length > 0 ? email.split('@')[0] : 'User';
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('username', username.charAt(0).toUpperCase() + username.slice(1));
                    updateNavbarForAuth();
                    var main = document.querySelector('main');
                    if (main) main.innerHTML = renderDashboardWelcome();
                }
            });

            // Render dashboard welcome (simulate post-login)
            function renderDashboardWelcome() {
                // 1. Update navbar links
                updateNavbarForAuth();
                // 2. Replace main content with interactive welcome
                return `
                    <div class="container dashboard-welcome" style="padding:4rem 0 2rem;max-width:700px;text-align:center;">
                        <div class="welcome-message animated-fadein">
                            <h2 style="font-size:2.2rem;font-weight:800;margin-bottom:0.7rem;">Welcome!</h2>
                            <p style="font-size:1.15rem;color:var(--subtext,#64748b);margin-bottom:2.2rem;">Let's get started. What would you like to do first?</p>
                        </div>
                        <div class="dashboard-action-cards">
                            <div class="action-card animated-slidein" data-action="events">
                                <div class="action-icon" style="background:linear-gradient(135deg,#06b6d4,#22d3ee);"><span style="font-size:2.2rem;">📊</span></div>
                                <div class="action-title">Browse Events</div>
                                <div class="action-desc">View event statistics, ongoing and upcoming events, and more.</div>
                            </div>
                            <div class="action-card animated-slidein" data-action="create">
                                <div class="action-icon" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);"><span style="font-size:2.2rem;">🛠️</span></div>
                                <div class="action-title">Create a New Team</div>
                                <div class="action-desc">Start a new team for an event and invite others to join.</div>
                            </div>
                            <div class="action-card animated-slidein" data-action="find">
                                <div class="action-icon" style="background:linear-gradient(135deg,#06d6a0,#22d3ee);"><span style="font-size:2.2rem;">🤝</span></div>
                                <div class="action-title">Find a Team to Join</div>
                                <div class="action-desc">Browse available teams and join one that fits your interests.</div>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Update navbar for authentication state
            function updateNavbarForAuth() {
                var navLinks = document.querySelector('.nav-links');
                if (!navLinks) return;
                // Remove all nav links and rebuild
                navLinks.innerHTML = '';
                var isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                var username = localStorage.getItem('username') || '';
                var newLinks = [
                    { text: 'Home', href: '#home' },
                    { text: 'Features', href: '#features' },
                    { text: 'Team', href: '#team' },
                    { text: 'Contact', href: '#contact' }
                ];
                newLinks.forEach(function(link) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.href = link.href;
                    a.textContent = link.text;
                    li.appendChild(a);
                    navLinks.appendChild(li);
                });
                // If logged in, show profile icon, else show Get Started
                if (isLoggedIn) {
                    var li = document.createElement('li');
                    var initial = username ? username.charAt(0).toUpperCase() : 'U';
                    var icon = document.createElement('div');
                    icon.className = 'profile-icon';
                    icon.textContent = initial;
                    icon.title = username;
                    li.appendChild(icon);
                    navLinks.appendChild(li);
                } else {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.href = '#';
                    a.className = 'cta-button';
                    a.textContent = 'Get Started';
                    li.appendChild(a);
                    navLinks.appendChild(li);
                }
            }

            // On page load, update navbar for auth
            document.addEventListener('DOMContentLoaded', function() {
                updateNavbarForAuth();
            });
                // Handle Create Team button (delegated)
                if (e.target.classList.contains('create-team-btn')) {
                    e.preventDefault();
                    const card = e.target.closest('.dashboard-card');
                    if (!card) return;
                    const eventId = parseInt(card.getAttribute('data-event-id'));
                    const event = getEventById(eventId);
                    if (!event) return;
                    const main = document.querySelector('main');
                    if (main) main.innerHTML = renderCreateTeamForm(event);
                }
            });

            // Render Create Team Form
            function renderCreateTeamForm(event) {
                return `
                <div class="create-team-card">
                    <h2 style="text-align:center;margin-bottom:2rem;">Create a Team for the "${event.title}"</h2>
                    <form id="create-team-form" autocomplete="off">
                        <label>Team Name <span style="color:#e11d48;">*</span>
                            <input type="text" name="teamName" required />
                        </label>
                        <label>Team Leader Name <span style="color:#e11d48;">*</span>
                            <input type="text" name="leader" required />
                        </label>
                        <label>Number of Team Members <span style="color:#e11d48;">*</span>
                            <input type="number" name="members" min="1" max="20" required />
                        </label>
                        <label>Team Details <span style="color:#e11d48;">*</span>
                            <textarea name="details" required rows="3"></textarea>
                        </label>
                        <label>Technology Requirements <span style="color:#e11d48;">*</span>
                            <input type="text" name="tech" required placeholder="e.g. Python, React, AWS" />
                        </label>
                        <button type="submit" class="dashboard-btn">Submit</button>
                    </form>
                </div>
                <div id="toast" style="position:fixed;top:2rem;left:50%;transform:translateX(-50%);z-index:9999;display:none;min-width:220px;padding:1rem 2rem;background:#22d3ee;color:#fff;border-radius:1.5rem;font-weight:600;box-shadow:0 4px 24px rgba(34,211,238,0.18);text-align:center;"></div>
                `;
            }

            // Handle Create Team Form Submission
            document.body.addEventListener('submit', function(e) {
                if (e.target && e.target.id === 'create-team-form') {
                    e.preventDefault();
                    const form = e.target;
                    const data = Object.fromEntries(new FormData(form).entries());
                    // Basic validation
                    let valid = true;
                    for (const key in data) {
                        if (!data[key] || (key === 'members' && (isNaN(data[key]) || data[key] < 1))) {
                            valid = false;
                            break;
                        }
                    }
                    if (!valid) {
                        showToast('Please fill all fields correctly.', true);
                        return;
                    }
                    // Add to myTeams
                    const eventTitle = document.querySelector('h2')?.textContent || '';
                    const eventMatch = /"(.+)"/.exec(eventTitle);
                    let eventObj = null;
                    if (eventMatch) {
                        eventObj = events.find(ev => ev.title === eventMatch[1]);
                    }
                    if (!eventObj) {
                        showToast('Event not found.', true);
                        return;
                    }
                    myTeams.push({
                        eventId: eventObj.id,
                        teamName: data.teamName,
                        leader: data.leader,
                        members: data.members,
                        details: data.details,
                        tech: data.tech,
                        status: 'Registered'
                    });
                    saveMyTeams();
                    showToast('Your team has been created!');
                    setTimeout(() => {
                        // Navigate to Analyze view
                        var main = document.querySelector('main');
                        if (main) main.innerHTML = renderAnalyzeView();
                    }, 1200);
                }
            });

            // Toast notification
            function showToast(msg, error) {
                const toast = document.getElementById('toast');
                if (!toast) return;
                toast.textContent = msg;
                toast.style.background = error ? '#e11d48' : '#22d3ee';
                toast.style.display = 'block';
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 1100);
            }
        // End of Create Team logic
        // ...existing code...
        });
        // Dashboard: Events link shows event stats and create button
        document.addEventListener('DOMContentLoaded', function() {
            // Delegate click after dashboard is loaded
            document.body.addEventListener('click', function(e) {
                // Only handle nav links after dashboard is shown
                var navLinks = document.querySelector('.nav-links');
                if (!navLinks) return;
                // Find Events link (after dashboard)
                if (e.target.tagName === 'A' && e.target.textContent === 'Events') {
                    e.preventDefault();
                    var main = document.querySelector('main');
                    if (main) {
                        main.innerHTML = `
                            <div class="container events-dashboard" style="padding:3rem 0 2rem;">
                                <h1 style="text-align:center;margin-bottom:2.5rem;">Event Statistics</h1>
                                <div class="event-stats-grid">
                                    <div class="event-card ongoing">
                                        <div class="event-count">12</div>
                                        <div class="event-label">Ongoing Events</div>
                                    </div>
                                    <div class="event-card upcoming">
                                        <div class="event-count">7</div>
                                        <div class="event-label">Upcoming Events</div>
                                    </div>
                                    <div class="event-card expired">
                                        <div class="event-count">3</div>
                                        <div class="event-label">Expired Events</div>
                                    </div>
                                </div>
                                <button class="create-event-btn" title="Create Event">+</button>
                            </div>
                        `;
                    }
                }
            });
        });
        // TeamBuilders logo reloads the page to return to homepage
        document.addEventListener('DOMContentLoaded', function() {
            var logo = document.querySelector('.logo');
            if (logo) {
                logo.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.reload();
                });
            }
        });
        // Get Started button: update navbar and main content
        document.addEventListener('DOMContentLoaded', function() {
            function showDashboardAndUpdateNav() {
                // 1. Update navbar links
                var navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.innerHTML = '';
                    var newLinks = [
                        { text: 'Events', href: '#' },
                        { text: 'Create', href: '#' },
                        { text: 'Find', href: '#' },
                        { text: 'Analyze', href: '#' }
                    ];
                    newLinks.forEach(function(link) {
                        var li = document.createElement('li');
                        var a = document.createElement('a');
                        a.href = link.href;
                        a.textContent = link.text;
                        a.style.cursor = 'pointer';
                        li.appendChild(a);
                        navLinks.appendChild(li);
                    });
                }
                // 2. Replace main content with interactive welcome
                var main = document.querySelector('main');
                if (main) {
                    main.innerHTML = `
                        <div class="container dashboard-welcome" style="padding:4rem 0 2rem;max-width:700px;text-align:center;">
                            <div class="welcome-message animated-fadein">
                                <h2 style="font-size:2.2rem;font-weight:800;margin-bottom:0.7rem;">Welcome, Alex!</h2>
                                <p style="font-size:1.15rem;color:var(--subtext,#64748b);margin-bottom:2.2rem;">Let's get started. What would you like to do first?</p>
                            </div>
                            <div class="dashboard-action-cards">
                                <div class="action-card animated-slidein" data-action="events">
                                    <div class="action-icon" style="background:linear-gradient(135deg,#06b6d4,#22d3ee);"><span style="font-size:2.2rem;">📊</span></div>
                                    <div class="action-title">Browse Events</div>
                                    <div class="action-desc">View event statistics, ongoing and upcoming events, and more.</div>
                                </div>
                                <div class="action-card animated-slidein" data-action="create">
                                    <div class="action-icon" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);"><span style="font-size:2.2rem;">🛠️</span></div>
                                    <div class="action-title">Create a New Team</div>
                                    <div class="action-desc">Start a new team for an event and invite others to join.</div>
                                </div>
                                <div class="action-card animated-slidein" data-action="find">
                                    <div class="action-icon" style="background:linear-gradient(135deg,#06d6a0,#22d3ee);"><span style="font-size:2.2rem;">🤝</span></div>
                                    <div class="action-title">Find a Team to Join</div>
                                    <div class="action-desc">Browse available teams and join one that fits your interests.</div>
                                </div>
                            </div>
                        </div>
                    `;
                    // Animate cards in sequence
                    setTimeout(() => {
                        document.querySelector('.welcome-message')?.classList.add('visible');
                        document.querySelectorAll('.action-card').forEach((el, i) => {
                            setTimeout(() => el.classList.add('visible'), 200 + i * 120);
                        });
                    }, 100);
                    // Card click handlers
                    document.querySelectorAll('.action-card').forEach(card => {
                        card.addEventListener('click', function() {
                            const action = this.getAttribute('data-action');
                            if (action === 'events') {
                                // Simulate click on Events nav link
                                const nav = document.querySelector('.nav-links a');
                                if (nav && nav.textContent === 'Events') nav.click();
                            } else if (action === 'create') {
                                const nav = Array.from(document.querySelectorAll('.nav-links a')).find(a => a.textContent === 'Create');
                                if (nav) nav.click();
                            } else if (action === 'find') {
                                const nav = Array.from(document.querySelectorAll('.nav-links a')).find(a => a.textContent === 'Find');
                                if (nav) nav.click();
                            }
                        });
                    });
                }
            }
            // Both nav and hero buttons
            var getStartedBtn = document.querySelector('.cta-button');
            if (getStartedBtn) {
                getStartedBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showDashboardAndUpdateNav();
                });
            }
            var startBuildingBtn = document.querySelector('.btn-primary');
            if (startBuildingBtn) {
                startBuildingBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showDashboardAndUpdateNav();
                });
            }
        });
        // Add dashboard welcome and action card styles
        const dashWelcomeStyle = document.createElement('style');
        dashWelcomeStyle.textContent = `
            .dashboard-welcome { max-width: 700px; margin: 0 auto; }
            .dashboard-action-cards {
                display: flex;
                flex-wrap: wrap;
                gap: 2rem;
                justify-content: center;
                margin-top: 1.5rem;
            }
            .action-card {
                background: var(--card-bg,#fff);
                border-radius: 1.5rem;
                box-shadow: 0 4px 24px rgba(79,70,229,0.08);
                padding: 2rem 1.5rem 1.5rem;
                min-width: 220px;
                max-width: 260px;
                flex: 1 1 220px;
                text-align: center;
                cursor: pointer;
                transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
                opacity: 0;
                transform: translateY(40px) scale(0.98);
            }
            .action-card.visible {
                opacity: 1;
                transform: translateY(0) scale(1);
                transition: opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1), box-shadow 0.3s;
            }
            .action-card:hover {
                box-shadow: 0 8px 32px rgba(79,70,229,0.16);
                transform: translateY(-6px) scale(1.04);
                background: var(--card-hover-bg,#f1f5f9);
            }
            .action-icon {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.2rem;
                color: #fff;
                box-shadow: 0 2px 8px rgba(34,211,238,0.10);
            }
            .action-title {
                font-size: 1.15rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                color: #4f46e5;
            }
            .action-desc {
                color: #64748b;
                font-size: 0.98rem;
                margin-bottom: 0.2rem;
            }
            .welcome-message {
                opacity: 0;
                transform: translateY(-30px);
                transition: opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1);
            }
            .welcome-message.visible {
                opacity: 1;
                transform: translateY(0);
            }
            @media (max-width: 900px) {
                .dashboard-action-cards { flex-direction: column; align-items: center; }
                .action-card { max-width: 90vw; }
            }
            body.dark .action-card {
                --card-bg: #23232a;
                --card-hover-bg: #18181b;
                color: #e2e8f0;
            }
            body.dark .action-title { color: #06d6a0; }
            body.dark .action-desc { color: #a5b4fc; }
            body.dark .welcome-message h2, body.dark .welcome-message p { color: #e2e8f0 !important; }
        `;
        document.head.appendChild(dashWelcomeStyle);
        // Minimal theme toggle logic
        function setTheme(theme) {
            document.body.classList.remove('light', 'dark');
            document.body.classList.add(theme);
            localStorage.setItem('theme', theme);
        }
        function getPreferredTheme() {
            return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        }
        document.addEventListener('DOMContentLoaded', function() {
            setTheme(getPreferredTheme());
            var btn = document.getElementById('theme-toggle');
            if (btn) {
                btn.addEventListener('click', function() {
                    var newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
                    setTheme(newTheme);
                });
            }
        });
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            const isDark = document.body.classList.contains('dark');
            if (window.scrollY > 100) {
                header.style.background = isDark ? 'rgba(24,24,27,0.98)' : 'rgba(255,255,255,0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = isDark ? 'rgba(24,24,27,0.95)' : 'rgba(255,255,255,0.95)';
                header.style.boxShadow = 'none';
            }
        });

        // Staggered Intersection Observer for .feature-card and .team-member
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        function staggerIn(elements, delayStep = 120) {
            elements.forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, i * delayStep);
            });
        }

        const featureCards = Array.from(document.querySelectorAll('.feature-card'));
        const teamMembers = Array.from(document.querySelectorAll('.team-member'));

        // Observe features section
        if (featureCards.length) {
            const featuresSection = document.querySelector('.features');
            if (featuresSection) {
                const featuresObserver = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            staggerIn(featureCards);
                            obs.disconnect();
                        }
                    });
                }, observerOptions);
                featuresObserver.observe(featuresSection);
            }
        }
        // Observe team section
        if (teamMembers.length) {
            const teamSection = document.querySelector('.team');
            if (teamSection) {
                const teamObserver = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            staggerIn(teamMembers);
                            obs.disconnect();
                        }
                    });
                }, observerOptions);
                teamObserver.observe(teamSection);
            }
        }

        // Counter animation
        function animateCounter(elementId, targetValue, suffix = '') {
            const element = document.getElementById(elementId);
            let currentValue = 0;
            const increment = targetValue / 50;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(currentValue) + suffix;
            }, 30);
        }

        // Stats animation when visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter('teams-count', 20, '+');
                    animateCounter('users-count', 20, '+');
                    animateCounter('projects-count', 20, '+');
                    animateCounter('satisfaction-count', 98, '%');
                    statsObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statsObserver.observe(document.querySelector('.stats'));

        // Mobile menu toggle
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');

        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Add mobile menu styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .nav-links.active {
                    display: flex;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    flex-direction: column;
                    padding: 2rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    gap: 1rem;
                }

                .mobile-menu.active span:nth-child(1) {
                    transform: rotate(45deg) translate(6px, 6px);
                }

                .mobile-menu.active span:nth-child(2) {
                    opacity: 0;
                }

                .mobile-menu.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(6px, -6px);
                }
            }
        `;
        document.head.appendChild(style);

        // Parallax effect for hero background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Add loading animation
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });

        // Dynamic gradient animation
        let gradientAngle = 135;
        setInterval(() => {
            gradientAngle += 1;
            if (gradientAngle > 360) gradientAngle = 0;
            document.querySelector('.hero').style.background = 
                `linear-gradient(${gradientAngle}deg, #667eea 0%, #764ba2 100%)`;
        }, 100);