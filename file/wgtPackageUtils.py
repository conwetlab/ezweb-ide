import os, zipfile

class WgtPackageUtils:
	def __init__(self):
		self.extension = ".wgt"

	# create a new widget package
	def create(self, folder, filename, templateFileContents, templateFileName):
		templateFileName = os.path.normpath(templateFileName)

		zip_file = zipfile.ZipFile(filename + self.extension, 'w')

		self.addFolder(zip_file, folder, templateFileName)

		# Template file
		zip_file.writestr(str(templateFileName), templateFileContents)

		zip_file.close()


	# Add a folder to wgt file
	def addFolder(self, zip_file, folder, templateFileName):
		# check if folder is empty
		if len(os.listdir(folder)) == 0:
			zip_file.write(folder + "/")
			return

		for file in os.listdir(folder):
			full_path = os.path.normpath(os.path.join(folder, file))

			if full_path == templateFileName:
				continue

			if os.path.isfile(full_path):
				zip_file.write(full_path)
			elif os.path.isdir(full_path):
				self.addFolder(zip_file, full_path, templateFileName)
