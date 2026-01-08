import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('community');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Community & Support</CardTitle>
        <div className="flex space-x-2 pt-4">
          <Button
            variant={activeTab === 'community' ? 'default' : 'outline'}
            onClick={() => setActiveTab('community')}
          >
            Community
          </Button>
          <Button
            variant={activeTab === 'peer' ? 'default' : 'outline'}
            onClick={() => setActiveTab('peer')}
          >
            Peer Support
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'community' && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">Community Forum</h3>
            <p className="text-muted-foreground">Coming soon! A place to connect with others.</p>
          </div>
        )}
        {activeTab === 'peer' && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">Peer Support Matching</h3>
            <p className="text-muted-foreground">Coming soon! Connect one-on-one with a peer.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Community;
