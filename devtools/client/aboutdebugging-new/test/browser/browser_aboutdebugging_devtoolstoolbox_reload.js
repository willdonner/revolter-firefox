/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

// Test can run for a long time on debug platforms.
requestLongerTimeout(5);

/* import-globals-from helper-collapsibilities.js */
Services.scriptloader.loadSubScript(CHROME_URL_ROOT + "helper-collapsibilities.js", this);

const TOOLS = [
  "inspector",
  "webconsole",
  "jsdebugger",
  "styleeditor",
  "performance",
  "memory",
  "netmonitor",
  "storage",
  "accessibility",
];

/**
 * Test whether about:devtools-toolbox display correctly after reloading.
 */
add_task(async function() {
  info("Force all debug target panes to be expanded");
  prepareCollapsibilitiesTest();

  for (const toolId of TOOLS) {
    await testReloadAboutDevToolsToolbox(toolId);
  }
});

async function testReloadAboutDevToolsToolbox(toolId) {
  const { document, tab, window } = await openAboutDebugging();
  await selectThisFirefoxPage(document, window.AboutDebugging.store);
  const { devtoolsBrowser, devtoolsTab, devtoolsWindow } =
    await openAboutDevtoolsToolbox(document, tab, window);

  info(`Select tool: ${toolId}`);
  const toolbox = getToolbox(devtoolsWindow);
  await toolbox.selectTool(toolId);

  info("Reload about:devtools-toolbox page");
  devtoolsBrowser.reload();
  await gDevTools.once("toolbox-ready");
  ok(true, "Toolbox is re-created again");

  info("Check whether about:devtools-toolbox page displays correctly");
  ok(devtoolsBrowser.contentDocument.querySelector(".debug-target-info"),
     "about:devtools-toolbox page displays correctly");

  await closeAboutDevtoolsToolbox(document, devtoolsTab, window);
  await removeTab(tab);
}
