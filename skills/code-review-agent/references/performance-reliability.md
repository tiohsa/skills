# Performance And Reliability

Apply these checks to data access, asynchronous work, shared state, I/O, and resource-heavy paths.

## Data Access

- Look for N+1 queries and remote calls inside loops.
- Check pagination, limits, filtering, and bulk operations.
- Avoid loading unbounded datasets into memory.
- Verify transaction scope and partial-failure behavior.

## Resources

- Close files, streams, sockets, database handles, and response bodies.
- Check cancellation, timeout, retry, and backoff behavior where relevant.
- Avoid retrying non-idempotent operations unless duplication is handled.

## Concurrency

- Check races, lost updates, deadlocks, lock ordering, and shared mutable state.
- Confirm asynchronous work is awaited, observed, or intentionally detached.
- Review queue growth, worker limits, cache invalidation, and duplicate processing.

## Performance Claims

Report performance findings only when the diff introduces a realistic cost increase or resource leak. Describe the workload that triggers the problem.
