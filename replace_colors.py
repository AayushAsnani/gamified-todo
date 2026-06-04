import re

with open('src/App.css', 'r') as f:
    css = f.read()

# Replace hex codes
replacements = {
    '#1e293b': 'var(--canvas)',
    '#334155': 'var(--border)',
    '#0f172a': 'var(--canvas)',
    '#f1f5f9': 'var(--ink)',
    '#94a3b8': 'var(--muted)',
    '#818cf8': 'var(--accent)',
    '#a78bfa': 'var(--accent-2)',
    '#6f7e96': 'var(--card)',
    'rgba(30, 41, 59,': 'rgba(243, 239, 222,',
    'rgba(15, 23, 42,': 'rgba(243, 239, 222,',
    'rgba(129, 140, 248,': 'rgba(219, 161, 172,',
    'rgba(51, 65, 85,': 'rgba(219, 161, 172,',
    '#ffffff': 'var(--canvas)',
    '#fff': 'var(--canvas)'
}

for old, new in replacements.items():
    css = css.replace(old, new)
    # also handle uppercase hex just in case
    if old.startswith('#'):
        css = css.replace(old.upper(), new)

with open('src/App.css', 'w') as f:
    f.write(css)

print("Replaced colors in App.css")
