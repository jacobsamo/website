# The Design Viewer
The design viewer is a component that allows you to showcase a design inside of it, giving the ability to do things like change the theme, refresh the animation and more.

## Features
- **Controlled & Uncontrolled Modes** - Use as a controlled component with full state management, or let it manage its own state
- **Theme Switching** - Toggle between light and dark themes
- **Animation Refresh** - Force remount children to reset animations
- **Built-in Controls** - Optional hover-activated theme and refresh buttons
- **Developer-Friendly API** - Clean callback-based API following React 19 best practices

## Usage

### Uncontrolled Mode (Basic Example)
The simplest way to use DesignViewer - it manages its own theme and refresh state internally. Built-in controls are always visible:

```tsx
<DesignViewer>
  <YourComponent />
</DesignViewer>
```

### Controlled Mode (Theme Only)
Control just the theme while letting the component handle refresh internally:

```tsx
const [theme, setTheme] = useState<"light" | "dark">("light");

<DesignViewer theme={theme} onThemeChange={setTheme}>
  <YourComponent />
</DesignViewer>
```

### Fully Controlled Mode
Take full control of both theme and refresh state from the parent component:

```tsx
const [theme, setTheme] = useState<"light" | "dark">("light");
const [refreshKey, setRefreshKey] = useState(0);

<DesignViewer
  theme={theme}
  onThemeChange={setTheme}
  refreshKey={refreshKey}
  onRefresh={() => setRefreshKey(prev => prev + 1)}
>
  <YourComponent />
</DesignViewer>
```

### Custom Controls with Hidden Built-in Controls
Use controlled mode to implement your own theme and refresh controls:

```tsx
const [theme, setTheme] = useState<"light" | "dark">("light");
const [refreshKey, setRefreshKey] = useState(0);

return (
  <>
    <div className="flex gap-2 mb-4">
      <button onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
      <button onClick={() => setRefreshKey(prev => prev + 1)}>
        Refresh
      </button>
    </div>

    <DesignViewer
      theme={theme}
      onThemeChange={setTheme}
      refreshKey={refreshKey}
      onRefresh={() => setRefreshKey(prev => prev + 1)}
      showControls={false}
    >
      <YourComponent />
    </DesignViewer>
  </>
);
```

### Custom Styling
You can customize the styling of different parts of the DesignViewer using the `classes` prop:

```tsx
<DesignViewer
  classes={{
    containerClassName: "h-screen rounded-xl border-2",
    contentClassName: "grid grid-cols-2 gap-4 p-8"
  }}
>
  <YourComponent />
</DesignViewer>
```

## Props

### Control Props
- `theme` (`"light" | "dark"`, optional) - Current theme. When provided, component becomes controlled for theme
- `onThemeChange` (`(theme: "light" | "dark") => void`, optional) - Callback when theme changes
- `refreshKey` (`number`, optional) - Key used to force remount children (useful for resetting animations). When provided, component becomes controlled for refresh. When not provided, component manages refresh state internally
- `onRefresh` (`() => void`, optional) - Callback when refresh is triggered. Called whether in controlled or uncontrolled mode

### Display Props
- `showControls` (`boolean`, default: `true`) - Show/hide the built-in theme and refresh controls
- `classes` (`object`, optional) - Custom class names for styling:
  - `containerClassName` - Main container styling
  - `contentClassName` - Content wrapper styling

### Content Props
- `children` (`React.ReactNode`, required) - The content to display inside the viewer

## Tailwind CSS IntelliSense

The component is configured to work with Tailwind CSS IntelliSense. The `classes` prop properties use `ClassNameValue` type which helps VSCode recognize them as className strings.

If IntelliSense isn't working, add this to your `.vscode/settings.json`:

```json
{
  "tailwindCSS.experimental.classRegex": [
    ["classes\\s*=\\s*\\{([^}]*)", "\"([^\"]*)\""],
    ["containerClassName:\\s*[\"'`]([^\"'`]*)[\"'`]"],
    ["buttonContainerClassName:\\s*[\"'`]([^\"'`]*)[\"'`]"],
    ["contentClassName:\\s*[\"'`]([^\"'`]*)[\"'`]"]
  ]
}
```


## TODO
- [X] Theme Switcher
- [X] Animation Refresh
- [ ] Layout & Scaling
  - [ ] Expand to full screen
  - [ ] Controlls to dynamically scale to be smaller or larger (only avabile on larger screens)
  - [ ] Popover select of Mobile, Tablet and Desktop view (dynamically selected based on device and screen size, making it not able to scale to desktop on a mobile device)
- [ ] Preview Code - would be great if this could be inferd or ability to pass the components in to showcase the code
- [ ] Animation Controlls
  - [ ] Slow down animation
  - [ ] Pauce animation
  - [ ] Show the animation variants e.g Error, hover, etc
- [ ] 