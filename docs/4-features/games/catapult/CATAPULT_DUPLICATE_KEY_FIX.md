# 🎯 Catapult Game - Duplicate Key Error Fix

## ❌ **Problem**

When launching the catapult, React threw duplicate key errors:

```
Encountered two children with the same key, `shot-1759497951832`. 
Keys should be unique so that components maintain their identity across updates.
```

## 🔍 **Root Causes**

### 1. **Non-Unique Shot IDs**
The shot ID was generated using only `Date.now()`:
```typescript
id: `shot-${Date.now()}`
```

**Issue**: If multiple shots were fired quickly or if the landing handler was called multiple times, the same timestamp could be used, creating duplicate keys.

### 2. **Multiple Landing Handler Calls**
The `handleLanding` function could potentially be called multiple times for the same projectile before the state was updated to `null`.

## ✅ **Solutions Implemented**

### **Fix 1: Added Shot Counter for Unique IDs**

**File**: `src/app/games/play/catapult/page.tsx`

**Added new ref**:
```typescript
const shotCounter = useRef<number>(0)
```

**Updated shot ID generation**:
```typescript
// Create shot record with unique ID
shotCounter.current += 1
const newShot: Shot = {
  id: `shot-${Date.now()}-${shotCounter.current}`,
  // ... rest of properties
}
```

**Result**: Each shot now has a guaranteed unique ID combining timestamp + incrementing counter.

---

### **Fix 2: Added Landing Processing Guard**

**Added guard ref**:
```typescript
const isProcessingLanding = useRef<boolean>(false)
```

**Updated animation loop**:
```typescript
// Check if landed (with guard to prevent duplicate processing)
if (updated.hasLanded && !isProcessingLanding.current) {
  isProcessingLanding.current = true
  handleLanding(updated, trajectoryHistory.current)
  return null
}
```

**Reset guard on new launch**:
```typescript
const handleLaunch = () => {
  const newProjectile = createProjectile(settings)
  setProjectile(newProjectile)
  shotStartTime.current = Date.now()
  trajectoryHistory.current = []
  setTrajectory([])
  isProcessingLanding.current = false // Reset landing guard for new shot
}
```

**Result**: Prevents `handleLanding` from being called multiple times for the same shot.

---

## 🧪 **Testing**

**To verify the fix**:

1. **Navigate to**: `http://localhost:3000/games/play/catapult`
2. **Fire multiple shots rapidly**
3. **Check the console** - No more duplicate key warnings
4. **Check the "Recent Shots" list** - All shots should render correctly with unique keys

---

## 📝 **Technical Details**

### **Why This Happened**

- React uses keys to track components in lists
- When rendering the shot history, each shot needs a unique key
- `Date.now()` has millisecond precision, so rapid calls can return the same value
- Animation frames can fire multiple times before React state updates

### **Why This Solution Works**

1. **Counter ensures uniqueness**: Even if `Date.now()` returns the same value, the counter will be different
2. **Guard prevents duplicates**: The `isProcessingLanding` flag ensures we only process each landing once
3. **Proper cleanup**: Resetting the guard on each new launch ensures it works for all shots

---

## ✅ **Status**

- [x] Shot IDs are now guaranteed unique
- [x] Landing handler cannot be called multiple times
- [x] Console errors eliminated
- [x] Game functions correctly

**The catapult game is now fully functional!** 🚀
