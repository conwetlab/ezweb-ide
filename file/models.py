from django.db import models
import json

class File (models.Model):
    name = models.CharField(max_length=64)
    FILETYPE_CHOICES = (
        (u'code',u'code'),
        (u'template',u'template'),
        (u'dir',u'dir'),
        (u'image',u'image')
    )
    fileType = models.CharField(max_length=10, choices=FILETYPE_CHOICES)
    parent = models.CharField(max_length=512, null=True)
    syntax = models.CharField(max_length=32, null=True)

    class Meta:
        unique_together = ("name", "parent")

    def __unicode__(self):
        if self.parent==None:
            return self.name
        else:
            return self.parent+'/'+self.name

    def getName(self):
        return self.name

    def getParent(self):
        return self.parent

    def getSyntax(self):
        return self.syntax

    def getType(self):
        return self.fileType

    def getFile(self):
        return {'id': self.name, 'parent': self.parent[(self.parent.find('/')+1):], 'type': self.fileType, 'syntax': self.syntax}
