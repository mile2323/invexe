from mongoengine import Document, DateTimeField
import datetime

class BaseDocument(Document):
    created_at = DateTimeField(default=datetime.datetime.now)
    updated_at = DateTimeField(default=datetime.datetime.now)
    meta = {'abstract': True}
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.now()
        return super(BaseDocument, self).save(*args, **kwargs)