# Zenodo Release Setup Guide
## Connecting GitHub to Zenodo for EDM v0.4.0

This guide walks you through connecting your GitHub repository to Zenodo and creating an archival release with a DOI.

---

## Prerequisites

- ✅ GitHub account with access to `deepadata/deepadata-edm-spec`
- ✅ All v0.4.0 files committed and pushed to GitHub
- ✅ Repository tagged as `v0.4.0`
- ⬜ Zenodo account (we'll create this)

---

## Part 1: Create Zenodo Account

### Step 1: Go to Zenodo

Visit: **https://zenodo.org/**

### Step 2: Sign Up with GitHub

1. Click **"Log in"** (top right)
2. Click **"Sign up"** 
3. Choose **"Sign in with GitHub"**
4. Authorize Zenodo to access your GitHub account
5. Complete your Zenodo profile

✅ **You now have a Zenodo account!**

---

## Part 2: Connect Repository to Zenodo

### Step 3: Enable GitHub Integration

1. Go to: **https://zenodo.org/account/settings/github/**
2. You'll see a list of your GitHub repositories
3. Find **`deepadata/deepadata-edm-spec`**
4. Toggle the switch to **ON** (green)

![Zenodo GitHub Integration](https://docs.github.com/assets/cb-34055/images/help/repository/zenodo-toggle.png)

### Step 4: Verify Connection

- The toggle should be **green/enabled**
- You'll see "Zenodo will archive new releases of this repository"
- A webhook was automatically added to your GitHub repo

---

## Part 3: Create GitHub Release

### Step 5: Go to GitHub Releases

1. Navigate to: **https://github.com/deepadata/deepadata-edm-spec/releases**
2. Click **"Draft a new release"**

### Step 6: Fill in Release Details

**Tag version:**
```
v0.4.0
```

**Release title:**
```
EDM v0.4.0 - Governance Domain & Schema Cleanup
```

**Description:** (Copy this template)

```markdown
## Emotional Data Model (EDM) v0.4.0

**Release Date:** December 4, 2025  
**Status:** Stable, Production-Ready

### 🎯 Major Release - Breaking Changes

EDM v0.4.0 introduces a cleaner, more maintainable schema with improved governance separation and reduced redundancy.

### ✨ Highlights

- **NEW:** GOVERNANCE domain (split from META, now required)
- **REMOVED:** 6 redundant fields (see migration guide)
- **IMPROVED:** Field descriptions standardized (~40% token reduction)
- **TOTAL:** 96 fields across 10 domains

### 📦 What's Included

- Complete JSON Schema for EDM v0.4.0
- 10 domain fragment schemas
- v0.3 → v0.4 migration crosswalk
- Comprehensive migration guide
- Updated examples and validation tools

### ⚠️ Breaking Changes

**Migration Required from v0.3.x**

See [Migration Guide](docs/V04_MIGRATION_GUIDE.md) for upgrade instructions.

**Deleted Fields:**
- `meta.session_id`
- `constellation.affective_clarity`
- `constellation.active_motivational_state`
- `milky_way.media_context`
- `milky_way.memory_layers`
- `gravity.tether_target`

**New Domain:**
- `governance` - Rights, retention, jurisdiction, k-anonymity

### 📚 Documentation

- [Migration Guide](docs/V04_MIGRATION_GUIDE.md)
- [Changelog](CHANGELOG.md)
- [Complete Schema Reference](docs/OVERVIEW.md)

### 🔗 Links

- **Zenodo DOI:** [Will be auto-populated after Zenodo archival]
- **Repository:** https://github.com/deepadata/deepadata-edm-spec
- **Whitepaper:** [Zenodo link pending]

### 📝 Citation

```bibtex
@software{harvey2025edm,
  author = {Harvey, Jason},
  title = {Emotional Data Model (EDM) v0.4: A Protocol for Governed Affective Context},
  year = {2025},
  publisher = {Zenodo},
  version = {0.4.0},
  doi = {10.5281/zenodo.XXXXXXX},
  url = {https://github.com/deepadata/deepadata-edm-spec}
}
```

---

**Full Changelog:** https://github.com/deepadata/deepadata-edm-spec/blob/main/CHANGELOG.md
```

### Step 7: Publish Release

1. Scroll down
2. Check **"Set as the latest release"** ✅
3. Click **"Publish release"**

✅ **GitHub release created!**

---

## Part 4: Zenodo Automatically Archives

### Step 8: Wait for Zenodo

After you publish the GitHub release:

1. **Zenodo is automatically notified** (via webhook)
2. Zenodo **downloads a snapshot** of your repository
3. Zenodo **assigns a DOI** to the release
4. This takes **5-15 minutes**

### Step 9: Check Zenodo for Your DOI

1. Go to: **https://zenodo.org/account/settings/github/**
2. Find your repository
3. Click on **"v0.4.0"** (the new release)
4. You'll see your new DOI: `10.5281/zenodo.XXXXXXX`

✅ **Your release is now on Zenodo with a DOI!**

---

## Part 5: Update Repository with DOI

### Step 10: Copy Your DOI

From the Zenodo page, copy:
- **Version DOI:** `10.5281/zenodo.XXXXXXX` (specific to v0.4.0)
- **Concept DOI:** `10.5281/zenodo.YYYYYYYY` (for all versions)

### Step 11: Update README.md

Add the DOI badge at the top of your README:

```markdown
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXXXX)
```

Replace `XXXXXXX` with your actual DOI number.

### Step 12: Update CITATION.cff

Update the DOI in your `CITATION.cff` file:

```yaml
doi: 10.5281/zenodo.XXXXXXX
```

### Step 13: Commit & Push Updates

```bash
git add README.md CITATION.cff
git commit -m "docs: add Zenodo DOI badge for v0.4.0 release"
git push
```

---

## Part 6: Upload Whitepaper to Zenodo (Optional)

### Step 14: Create Separate Whitepaper Upload

You can also upload your whitepaper PDF directly to Zenodo:

1. Go to: **https://zenodo.org/deposit/new**
2. Click **"New upload"**
3. Upload your whitepaper PDF
4. Fill in metadata:
   - **Title:** "Emotional Data Model (EDM) v0.4: A Protocol for Governed Affective Context"
   - **Authors:** Jason Harvey
   - **Description:** [Your abstract]
   - **Related identifiers:** Link to GitHub DOI
5. Click **"Publish"**

This gives you a **separate DOI for the whitepaper** (different from the code).

---

## Verification Checklist

After setup, verify:

- [ ] Zenodo shows your repository on the GitHub settings page
- [ ] v0.4.0 release appears on Zenodo with a DOI
- [ ] DOI badge added to README
- [ ] CITATION.cff updated with DOI
- [ ] Release notes link to Zenodo DOI
- [ ] GitHub release shows up on Zenodo's "Related identifiers"

---

## Troubleshooting

### Problem: Zenodo didn't archive my release

**Solutions:**
1. Check webhook: Go to GitHub → Settings → Webhooks
2. Verify Zenodo webhook exists and shows green checkmark
3. Try manually triggering: Zenodo → GitHub settings → "Sync now"

### Problem: Can't find my repo on Zenodo

**Solutions:**
1. Make sure repository is public (not private)
2. Refresh the Zenodo GitHub page
3. Try disabling and re-enabling the integration

### Problem: DOI not appearing

**Solutions:**
1. Wait 15-30 minutes (Zenodo can be slow)
2. Check your email for Zenodo notifications
3. Go to https://zenodo.org/uploads and check "Deposits"

---

## Future Releases

For future versions (v0.4.1, v0.5.0, etc.):

1. **Just create a GitHub release** - That's it!
2. Zenodo will automatically:
   - Archive the new version
   - Assign a new version-specific DOI
   - Update the concept DOI (all versions)
3. Update your README with the new DOI

---

## Links

- **Zenodo Help:** https://help.zenodo.org/
- **GitHub-Zenodo Guide:** https://docs.github.com/en/repositories/archiving-a-github-repository/referencing-and-citing-content
- **Zenodo GitHub Integration:** https://zenodo.org/account/settings/github/

---

## Summary

✅ **What You've Done:**
1. Created Zenodo account
2. Enabled GitHub integration
3. Published v0.4.0 release on GitHub
4. Got a permanent DOI from Zenodo
5. Updated docs with DOI

✅ **What You Have Now:**
- Permanent archival of v0.4.0 code
- Citable DOI for academic use
- Automatic archival for future releases
- Professional research repository

---

**Questions?** Open an issue or email: jason@deepadata.io

---

**Last Updated:** December 4, 2025
