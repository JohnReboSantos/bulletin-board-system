import React, { useEffect, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/RootStore';
import { Card, ListGroup, Pagination } from 'react-bootstrap';

const BoardPage: React.FC<{
  board: {
    id: number;
    name: string;
    topic: string;
    description: string;
    created_at: string;
  };
}> = ({ board }) => {
  const rootStore = useStore();

  const getThreads = useCallback(async () => {
    try {
      await rootStore.threads.getThreads();
    } catch (error) {
      console.error('Error getting threads:', error);
    }
  }, [rootStore.threads]);

  useEffect(() => {
    getThreads();
  }, [getThreads]);

  const memoizedThreads = useMemo(
    () => rootStore.threads.threads,
    [rootStore.threads.threads],
  );

  const renderThreads = useCallback(() => {
    return memoizedThreads.map((thread) => (
      <ListGroup.Item key={thread.id}>
        <div className="d-flex justify-content-between align-items-center">
          <div>{thread.title}</div>
          <div>
            {thread.locked && <span className="text-danger">Locked</span>}
          </div>
        </div>
        <div className="mt-2">
          <small>
            Last reply: {/* last reply */} by {/* last replier name*/}
          </small>
        </div>
      </ListGroup.Item>
    ));
  }, [memoizedThreads]);

  return (
    <div className="board-index-page">
      <h2>{board.name}</h2>
      <Card>
        <ListGroup variant="flush">{renderThreads()}</ListGroup>
      </Card>
      <Pagination className="mt-3">
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item active>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Item>{3}</Pagination.Item>
        <Pagination.Ellipsis />
        <Pagination.Next />
        <Pagination.Last />
      </Pagination>
    </div>
  );
};

export default observer(BoardPage);
