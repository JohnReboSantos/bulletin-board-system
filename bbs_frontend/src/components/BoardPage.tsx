import React from 'react';
import { Card, ListGroup, Pagination } from 'react-bootstrap';

const BoardIndexPage = () => {
  const threads = [
    {
      id: 1,
      title: 'Thread 1',
      lastReplyDate: '2023-06-01',
      lastReplierName: 'User A',
      locked: false,
    },
    {
      id: 2,
      title: 'Thread 2',
      lastReplyDate: '2023-06-02',
      lastReplierName: 'User B',
      locked: true,
    },
    // Add more thread objects as needed
  ];

  const renderThreads = () => {
    return threads.map((thread) => (
      <ListGroup.Item key={thread.id}>
        <div className="d-flex justify-content-between align-items-center">
          <div>{thread.title}</div>
          <div>
            {thread.locked && (
              <span className="text-danger">Locked</span>
            )}
          </div>
        </div>
        <div className="mt-2">
          <small>
            Last reply: {thread.lastReplyDate} by {thread.lastReplierName}
          </small>
        </div>
      </ListGroup.Item>
    ));
  };

  return (
    <div className="board-index-page">
      <h2>Board Name</h2>
      <Card>
        <ListGroup variant="flush">
          {renderThreads()}
        </ListGroup>
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

export default BoardIndexPage;
