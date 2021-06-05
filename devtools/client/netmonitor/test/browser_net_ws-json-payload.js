/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

/**
 * Test that WebSocket payloads containing a basic JSON message is parsed
 * correctly and displayed in a user friendly way
 */

add_task(async function() {
  await pushPref("devtools.netmonitor.features.webSockets", true);

  const { tab, monitor } = await initNetMonitor(WS_PAGE_URL, {
    requestCount: 1,
  });
  info("Starting test... ");

  const { document, store, windowRequire } = monitor.panelWin;
  const Actions = windowRequire("devtools/client/netmonitor/src/actions/index");

  store.dispatch(Actions.batchEnable(false));

  // Wait for WS connections to be established + send messages
  const onNetworkEvents = waitForNetworkEvents(monitor, 1);
  await SpecialPowers.spawn(tab.linkedBrowser, [], async () => {
    await content.wrappedJSObject.openConnection(0);
    content.wrappedJSObject.sendData(
      `{\"foo\":{\"x\":1,\"y\":2}, \"bar\":{\"x\":1,\"y\":2}}`
    );
  });
  await onNetworkEvents;

  const requests = document.querySelectorAll(".request-list-item");
  is(requests.length, 1, "There should be one request");

  // Wait for all sent/received messages to be displayed in DevTools
  const wait = waitForDOM(
    document,
    "#messages-view .message-list-table .message-list-item",
    2
  );

  // Select the first request
  EventUtils.sendMouseEvent({ type: "mousedown" }, requests[0]);

  // Click on the "Response" panel
  await clickOnSidebarTab(document, "response");
  await wait;

  // Get all messages present in the "Response" panel
  const frames = document.querySelectorAll(
    "#messages-view .message-list-table .message-list-item"
  );

  // Check expected results
  is(frames.length, 2, "There should be two frames");

  // Wait for next tick to do async stuff (The MessagePayload component uses the async function getMessagePayload)
  await waitForTick();
  const waitForData = waitForDOM(document, "#message-formattedData");
  const [requestFrame] = frames;
  EventUtils.sendMouseEvent({ type: "mousedown" }, requestFrame);

  await waitForData;

  is(
    document.querySelector("#message-formattedData-header").innerText,
    "JSON",
    "The JSON payload panel should be displayed"
  );

  ok(
    document.querySelector("#message-formattedData .treeTable"),
    "A tree table should be used to display the formatted payload"
  );

  ok(document.getElementById("/foo"), "The 'foo' property should be displayed");
  ok(
    document.getElementById("/foo/x"),
    "The 'x' property in the `foo` object should be displayed"
  );
  ok(
    document.getElementById("/bar/y"),
    "The 'y' property in the `bar` object should be displayed"
  );

  // Close WS connection
  await SpecialPowers.spawn(tab.linkedBrowser, [], async () => {
    await content.wrappedJSObject.closeConnection();
  });

  await teardown(monitor);
});