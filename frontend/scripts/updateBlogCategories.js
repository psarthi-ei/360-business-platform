#!/usr/bin/env node

/**
 * Blog Category Update Utility
 * Usage: node updateBlogCategories.js [options]
 * 
 * Examples:
 * - Update single post: node updateBlogCategories.js --post day55 --category "Tech Leadership"
 * - Update multiple posts: node updateBlogCategories.js --posts day1,day2,day3 --category "Entrepreneurship"
 * - Change category name globally: node updateBlogCategories.js --from "Personal Growth" --to "Personal Development"
 */

const fs = require('fs').promises;
const path = require('path');

const METADATA_PATH = '../../public/content/blog-metadata.json';

async function loadMetadata() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, METADATA_PATH), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading metadata:', error);
    process.exit(1);
  }
}

async function saveMetadata(metadata) {
  try {
    const jsonString = JSON.stringify(metadata, null, 2);
    await fs.writeFile(path.resolve(__dirname, METADATA_PATH), jsonString, 'utf8');
    
  } catch (error) {
    console.error('Error saving metadata:', error);
    process.exit(1);
  }
}

async function updatePostCategory(postId, newCategory) {
  const metadata = await loadMetadata();
  
  const post = metadata.find(p => p.id === postId);
  if (!post) {
    console.error(`❌ Post ${postId} not found`);
    return;
  }
  
  const oldCategory = post.primaryCategory;
  post.primaryCategory = newCategory;
  post.categories = [newCategory];
  
  await saveMetadata(metadata);
  
}

async function updateMultiplePosts(postIds, newCategory) {
  const metadata = await loadMetadata();
  let updated = 0;
  
  for (const postId of postIds) {
    const post = metadata.find(p => p.id === postId);
    if (post) {
      const oldCategory = post.primaryCategory;
      post.primaryCategory = newCategory;
      post.categories = [newCategory];
      
      updated++;
    } else {
      
    }
  }
  
  if (updated > 0) {
    await saveMetadata(metadata);
    
  }
}

async function renameCategoryGlobally(fromCategory, toCategory) {
  const metadata = await loadMetadata();
  let updated = 0;
  
  for (const post of metadata) {
    if (post.primaryCategory === fromCategory) {
      post.primaryCategory = toCategory;
      updated++;
    }
    
    const categoryIndex = post.categories.indexOf(fromCategory);
    if (categoryIndex !== -1) {
      post.categories[categoryIndex] = toCategory;
    }
  }
  
  if (updated > 0) {
    await saveMetadata(metadata);
    
  } else {
    
  }
}

async function listCategories() {
  const metadata = await loadMetadata();
  const categoryCount = {};
  
  metadata.forEach(post => {
    post.categories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
  });
  
  
  Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      
    });
}

// Command line argument parsing
const args = process.argv.slice(2);

function getArg(flag) {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : null;
}

async function main() {
  if (args.includes('--help') || args.length === 0) {
    console.log(`
📝 Blog Category Update Utility

Usage:
  node updateBlogCategories.js [options]

Options:
  --post <id>              Update single post (e.g., --post day55)
  --posts <id1,id2,id3>    Update multiple posts (comma-separated)
  --category <name>        New category name (use with --post or --posts)
  --from <old-name>        Rename category from this name
  --to <new-name>          Rename category to this name (use with --from)
  --list                   List all current categories
  --help                   Show this help

Examples:
  node updateBlogCategories.js --list
  node updateBlogCategories.js --post day55 --category "Tech Leadership"
  node updateBlogCategories.js --posts day1,day2,day3 --category "Entrepreneurship"
  node updateBlogCategories.js --from "Personal Growth" --to "Personal Development"
    `);
    return;
  }

  if (args.includes('--list')) {
    await listCategories();
    return;
  }

  const post = getArg('--post');
  const posts = getArg('--posts');
  const category = getArg('--category');
  const fromCategory = getArg('--from');
  const toCategory = getArg('--to');

  if (post && category) {
    await updatePostCategory(post, category);
  } else if (posts && category) {
    const postIds = posts.split(',').map(id => id.trim());
    await updateMultiplePosts(postIds, category);
  } else if (fromCategory && toCategory) {
    await renameCategoryGlobally(fromCategory, toCategory);
  } else {
    
  }
}

main().catch(console.error);