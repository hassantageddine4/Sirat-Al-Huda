require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'CapacitorCompassHeading'
  s.version = package['version']
  s.summary = package['description']
  s.license = package['license']
  s.homepage = 'https://github.com/sirat-al-huda/capacitor-compass-heading'
  s.author = 'Sirat Al Huda'
  s.source = { :git => 'https://github.com/sirat-al-huda/capacitor-compass-heading.git', :tag => s.version.to_s }
  s.source_files = 'ios/Plugin/**/*.{swift,h,m}'
  s.ios.deployment_target = '13.0'
  s.dependency 'Capacitor'
  s.swift_version = '5.1'
end
