# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

### Test group comments.

fake1 = Fake text

## Pass: This group comment has proper spacing.

fake2 = Fake text
## Fail: (GC03) Group comments should have an empty line before them.

fake3 = Fake text

## Fail: (GC02) Group comments should have an empty line after them.
fake4 = Fake text

## Pass: A single comment is fine.

## Fail: (GC04) A group comment must be followed by at least one message.

fake5 = Fake text


## Fail: (GC03) Only allow 1 line above.

fake6 = Fake text

## Fail: (GC02) Only allow 1 line below.


fake6 = Fake text

## Fail: (GC01) Group comments should not be at the end of a file.
