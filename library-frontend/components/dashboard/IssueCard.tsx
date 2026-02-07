'use client';

import React from 'react';
import { Issue } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { formatDate, isOverdue } from '@/utils/helpers';

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const overdue = !issue.returned && isOverdue(issue.due_date);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {issue.book_copy_details?.book.title || 'Book Title'}
            </h3>
            <p className="text-sm text-gray-600">
              Copy #{issue.book_copy_details?.copy_number || issue.book_copy}
            </p>
          </div>
          <Badge variant={issue.returned ? 'success' : overdue ? 'danger' : 'warning'}>
            {issue.returned ? 'Returned' : overdue ? 'Overdue' : 'Active'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Issued: {formatDate(issue.issue_date)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Due: {formatDate(issue.due_date)}</span>
          </div>

          {issue.return_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Returned: {formatDate(issue.return_date)}</span>
            </div>
          )}

          {overdue && (
            <div className="flex items-center text-sm text-red-600 mt-3 p-2 bg-red-50 rounded">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>This book is overdue!</span>
            </div>
          )}

          {issue.fine_amount && parseFloat(issue.fine_amount) > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-red-600 font-medium">
                Fine Amount: ${issue.fine_amount}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
